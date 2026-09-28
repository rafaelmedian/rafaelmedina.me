import SwiftUI
import AVFoundation
import PocketDexCore

/// Scan mode: the back camera feeds the scanner's CRT, and pressing SCAN
/// "identifies" whatever plushie is in front of it. The result is theatre, not
/// recognition: it picks a Pokémon from the catalog and never touches the
/// collection.

/// Owns the capture session. Starts and stops off the main thread.
@MainActor @Observable
final class CameraFeed {
    enum Status { case idle, running, unavailable, denied }
    private(set) var status: Status = .idle
    let session = AVCaptureSession()
    private let queue = DispatchQueue(label: "pocketdex.camera")
    private var configured = false

    func start() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized: configureAndRun()
        case .notDetermined:
            Task {
                if await AVCaptureDevice.requestAccess(for: .video) { configureAndRun() } else { status = .denied }
            }
        default: status = .denied
        }
    }

    func stop() {
        let session = session
        queue.async { if session.isRunning { session.stopRunning() } }
        if status == .running { status = .idle }
    }

    private func configureAndRun() {
        guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back),
              let input = try? AVCaptureDeviceInput(device: device) else {
            // The simulator has no camera; the screen shows static instead.
            status = .unavailable
            return
        }
        if !configured {
            session.beginConfiguration()
            session.sessionPreset = .high
            if session.canAddInput(input) { session.addInput(input) }
            session.commitConfiguration()
            configured = true
        }
        let session = session
        queue.async { session.startRunning() }
        status = .running
    }
}

/// The camera picture, filling its frame.
private struct CameraPreview: UIViewRepresentable {
    let session: AVCaptureSession
    final class PreviewView: UIView {
        override class var layerClass: AnyClass { AVCaptureVideoPreviewLayer.self }
        var previewLayer: AVCaptureVideoPreviewLayer { layer as! AVCaptureVideoPreviewLayer }
    }
    func makeUIView(context: Context) -> PreviewView {
        let view = PreviewView()
        view.previewLayer.session = session
        view.previewLayer.videoGravity = .resizeAspectFill
        return view
    }
    func updateUIView(_ view: PreviewView, context: Context) {}
}

/// Snow for when there is no camera to show.
private struct Static: View {
    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 15)) { timeline in
            Canvas { context, size in
                var seed = UInt64(timeline.date.timeIntervalSinceReferenceDate * 15)
                let cell: CGFloat = 4
                for y in stride(from: 0, to: size.height, by: cell) {
                    for x in stride(from: 0, to: size.width, by: cell) {
                        seed = seed &* 6364136223846793005 &+ 1442695040888963407
                        let level = Double(seed >> 58) / 64
                        context.fill(Path(CGRect(x: x, y: y, width: cell, height: cell)), with: .color(Dex.phosphor.opacity(level * 0.35)))
                    }
                }
            }
        }
    }
}

/// What the scanner screen shows in scan mode.
struct ScanScreen: View {
    let store: GameStore
    @State private var camera = CameraFeed()
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ZStack {
            feed
                // Phosphor-tint the picture so it reads as the Pokédex screen, not a viewfinder.
                .saturation(0)
                .colorMultiply(Dex.phosphor)
                .opacity(store.scanResult == nil ? 0.85 : 0.3)
            Reticle(active: store.scanning)
            if store.scanning, !reduceMotion { ScanLine() }
            VStack {
                HStack {
                    Text(store.scanning ? "SCANNING…" : store.scanResult == nil ? "SCAN MODE" : "MATCH FOUND")
                    Spacer()
                    Text(cameraLabel)
                }
                .font(.system(size: 11, weight: .bold, design: .monospaced)).tracking(1)
                .foregroundStyle(Dex.phosphor.opacity(0.8))
                Spacer()
                if let id = store.scanResult, let pokemon = Catalog.pokemon(id: id) {
                    ScanResultCard(pokemon: pokemon).transition(.scale(scale: 0.9).combined(with: .opacity))
                } else {
                    Text(store.scanning ? "Hold still…" : "Point the lens at a Pokémon plushie")
                        .font(.system(.callout, design: .monospaced, weight: .semibold))
                        .foregroundStyle(Dex.phosphor)
                        .padding(.horizontal, 10).padding(.vertical, 5)
                        .background(.black.opacity(0.55), in: Capsule())
                }
            }
            .padding(16)
        }
        .clipped()
        .animation(reduceMotion ? nil : Dex.reveal, value: store.scanResult)
        .onAppear { camera.start() }
        .onDisappear { camera.stop() }
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("scan-screen")
    }

    @ViewBuilder private var feed: some View {
        if camera.status == .running {
            CameraPreview(session: camera.session)
        } else {
            Static()
        }
    }

    private var cameraLabel: String {
        switch camera.status {
        case .running: "● LIVE"
        case .denied: "NO ACCESS"
        case .unavailable: "NO CAMERA"
        case .idle: "…"
        }
    }
}

/// Corner brackets that tighten while scanning.
private struct Reticle: View {
    let active: Bool
    var body: some View {
        GeometryReader { proxy in
            let side = min(proxy.size.width, proxy.size.height) * (active ? 0.52 : 0.62)
            let arm: CGFloat = 26
            Path { path in
                let rect = CGRect(x: (proxy.size.width - side) / 2, y: (proxy.size.height - side) / 2, width: side, height: side)
                for (corner, dx, dy) in [(CGPoint(x: rect.minX, y: rect.minY), 1.0, 1.0), (CGPoint(x: rect.maxX, y: rect.minY), -1.0, 1.0),
                                         (CGPoint(x: rect.minX, y: rect.maxY), 1.0, -1.0), (CGPoint(x: rect.maxX, y: rect.maxY), -1.0, -1.0)] {
                    path.move(to: CGPoint(x: corner.x + arm * dx, y: corner.y))
                    path.addLine(to: corner)
                    path.addLine(to: CGPoint(x: corner.x, y: corner.y + arm * dy))
                }
            }
            .stroke(Dex.phosphor, style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round))
            .shadow(color: Dex.phosphor, radius: 6)
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.6), value: active)
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }
}

/// A bright line sweeping down and up the picture.
private struct ScanLine: View {
    var body: some View {
        GeometryReader { proxy in
            Rectangle()
                .fill(LinearGradient(colors: [.clear, Dex.phosphor.opacity(0.9), .clear], startPoint: .top, endPoint: .bottom))
                .frame(height: 22)
                .shadow(color: Dex.phosphor, radius: 10)
                .phaseAnimator([0.0, 1.0]) { view, phase in
                    view.offset(y: phase * (proxy.size.height - 22))
                } animation: { _ in .easeInOut(duration: 0.9) }
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }
}

private struct ScanResultCard: View {
    let pokemon: Pokemon
    var body: some View {
        HStack(spacing: 14) {
            Image(pokemon.asset).resizable().scaledToFit()
                .frame(width: 110, height: 110)
                .shadow(color: .white.opacity(0.35), radius: 10)
            VStack(alignment: .leading, spacing: 4) {
                Text("No.\(pokemon.number)").font(.system(size: 11, weight: .bold, design: .monospaced)).foregroundStyle(Dex.phosphor.opacity(0.6))
                Text(pokemon.name).font(.system(.title2, design: .monospaced, weight: .bold)).foregroundStyle(Dex.phosphor)
                Text(pokemon.type.capitalized).font(.system(.footnote, design: .monospaced, weight: .semibold)).foregroundStyle(Dex.phosphor.opacity(0.8))
                Text(String(format: "%.1f m · %.1f kg", pokemon.height, pokemon.weight))
                    .font(.system(.footnote, design: .monospaced)).foregroundStyle(Dex.phosphor.opacity(0.7))
            }
            Spacer(minLength: 0)
        }
        .padding(12)
        .background(.black.opacity(0.7), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 12, style: .continuous).strokeBorder(Dex.phosphor.opacity(0.4), lineWidth: 1))
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("scan-result")
    }
}
