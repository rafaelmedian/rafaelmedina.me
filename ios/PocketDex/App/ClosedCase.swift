import SwiftUI

/// The outer display is the front of the closed Pokédex. The body's lens
/// strip wraps the outer camera; below the stepped seam is the flap, hinged
/// on the left edge where the Duo folds.
struct ClosedCase: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var glow = 1.0

    var body: some View {
        GeometryReader { proxy in
            let size = proxy.size
            let safe = proxy.safeAreaInsets
            let camera = proxy.deviceRegions.camera
            let lens = LensGeometry(camera: camera, panel: CGRect(origin: .zero, size: size), safe: safe)
            let seam = lens.seam(hinge: -20, edge: size.width + 20)
            let flap = seam + [CGPoint(x: size.width + 20, y: size.height + 20), CGPoint(x: -20, y: size.height + 20)]
            let flapMid = (lens.seamLow + size.height) / 2
            ZStack(alignment: .topLeading) {
                ShellBackground()
                FlapPlastic(outline: flap)
                Polyline(points: seam, corner: 12).groove(2.5)
                // Closed, the hinge shows only its near half along the edge.
                Capsule().fill(Color(red: 0.12, green: 0.01, blue: 0.03)).blur(radius: 1.5)
                    .frame(width: 46, height: size.height - lens.seamHigh + 12)
                    .position(x: 0, y: (lens.seamHigh + size.height) / 2 + 3)
                HingeBarrel()
                    .frame(width: 40, height: size.height - lens.seamHigh + 6)
                    .position(x: 0, y: (lens.seamHigh + size.height) / 2 + 3)
                LensStrip(lens: lens, glow: glow, lights: (false, false, true))

                VStack(alignment: .leading, spacing: 10) {
                    Text("POKÉDEX")
                        .font(.system(size: 34, weight: .black, design: .rounded)).tracking(-0.5)
                        .foregroundStyle(Dex.groove.opacity(0.5))
                        .shadow(color: .white.opacity(0.3), radius: 0, y: 1.2)
                    HStack(spacing: 8) {
                        LCD {
                            Text(String(format: "%02d/12", store.game.captured.count))
                                .font(.system(size: 13, weight: .semibold, design: .monospaced))
                        }
                        Engraved(text: "FOUND", size: 9)
                    }
                }
                .padding(.leading, 40)
                .padding(.top, lens.seamLow + 34)
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("PocketDex. \(store.game.captured.count) of 12 discovered.")

                Opener(reduceMotion: reduceMotion)
                    .position(x: size.width - max(safe.trailing, 0) - 20, y: flapMid)

                Capsule().fill(Dex.groove.opacity(0.55))
                    .overlay(Capsule().stroke(.white.opacity(0.22), lineWidth: 1).offset(y: 1.2))
                    .frame(width: size.width * 0.36, height: 6)
                    .position(x: size.width / 2 + 8, y: size.height - max(safe.bottom, 16) - 14)
                    .accessibilityHidden(true)

                DotGrille(rows: 2, columns: 8, dot: 4, gap: 4)
                    .position(x: 40 + 30, y: size.height - max(safe.bottom, 16) - 44)

                if store.fold.supportsManualOpening {
                    Button { store.setManualOpen(true) } label: {
                        HStack(spacing: 10) {
                            Text("Open case").font(.system(.headline, design: .rounded, weight: .bold))
                            Image(systemName: "arrow.left.to.line").font(.subheadline.weight(.bold))
                        }.padding(.horizontal, 8)
                    }
                    .buttonStyle(KeyCapStyle(tint: .yellow, wake: 0))
                    .accessibilityIdentifier("open-case")
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
                    .padding(.trailing, 28 + safe.trailing)
                    .padding(.bottom, max(safe.bottom, 16) + 56)
                }
            }
            .frame(width: size.width, height: size.height)
            .onChange(of: lens, initial: true) {
                if camera != nil { store.lensAnchor = lens.anchor(in: CGRect(origin: .zero, size: size)) }
            }
        }
        .ignoresSafeArea()
        .onAppear {
            // Closing puts the scanner to sleep: the lens glows, then dims.
            glow = 1
            guard !reduceMotion else { glow = 0.2; return }
            withAnimation(.easeOut(duration: 1.1).delay(0.15)) { glow = 0.2 }
        }
        .accessibilityElement(children: .contain)
    }
}

/// The yellow catch on the flap's free edge, pointing the way it swings.
private struct Opener: View {
    let reduceMotion: Bool
    var body: some View {
        let shape = Triangle()
        ZStack {
            shape.fill(Color(red: 0.72, green: 0.46, blue: 0.04)).offset(x: 1.5, y: 3)
            shape.fill(LinearGradient(colors: [Color(red: 1, green: 0.9, blue: 0.5), Dex.yellow], startPoint: .top, endPoint: .bottom))
                .overlay(shape.stroke(.white.opacity(0.5), lineWidth: 1).padding(1.5))
        }
        .frame(width: 22, height: 34)
        .shadow(color: .black.opacity(0.25), radius: 3, y: 2)
        .phaseAnimator(reduceMotion ? [0.0] : [0.0, 1.0]) { view, phase in
            view.offset(x: -4 * phase)
        } animation: { _ in .easeInOut(duration: 0.9) }
        .accessibilityHidden(true)
    }
}
