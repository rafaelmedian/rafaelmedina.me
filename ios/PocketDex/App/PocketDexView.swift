import SwiftUI

struct PocketDexView: View {
    let store: GameStore
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    /// A timed power-on that runs each time the case opens. The hinge angle
    /// caps it, so a slow unfold wakes the Pokédex as it opens.
    @State private var boot = 0.0
    /// Rises when the Pokédex is woken and falls when it is put to sleep.
    @State private var wake = 0.0
    private var presenting: Bool { store.fold.isOpen && scenePhase == .active && !store.collectionVisible }
    private var presentationID: String { "\(presenting)-\(store.game.round.pokemonID)-\(store.game.round.revealed)" }
    private var power: Double {
        guard store.fold.isOpen else { return 0 }
        if reduceMotion { return 1 }
        let angle = store.fold.supportsManualOpening ? 1 : smoothstep(store.hingeAngle, 25, 115)
        return min(boot, angle)
    }

    var body: some View {
        ZStack {
            if store.fold.isOpen {
                InnerDisplay(store: store).transition(.opacity)
            } else {
                ClosedCase(store: store).transition(.opacity)
            }
        }
        .environment(\.dexPower, min(power, wake))
        .environment(\.deckPower, power)
        .background(Dex.ink.ignoresSafeArea())
        .statusBarHidden(true)
        .persistentSystemOverlays(.hidden)
        .animation(reduceMotion ? nil : Dex.quick, value: store.fold.isOpen)
        .modifier(FoldObserver(store: store))
        .task(id: presentationID) {
            if presenting { await store.presentCapture(reduceMotion: reduceMotion) }
        }
        .task(id: store.fold.isOpen) { await runBoot() }
        .task(id: store.asleep) { await runWake() }
        .onChange(of: scenePhase) { _, next in
            if next != .active { store.stopFeedback() }
        }
    }

    /// Waking replays the power-on; sleeping collapses the screens quickly.
    private func runWake() async {
        if reduceMotion { wake = store.asleep ? 0 : 1; return }
        let from = wake
        let to: Double = store.asleep ? 0 : 1
        let duration = store.asleep ? 0.45 : 1.35
        let start = Date.now
        while !Task.isCancelled {
            let t = min(Date.now.timeIntervalSince(start) / duration, 1)
            wake = from + (to - from) * t
            if t >= 1 { break }
            try? await Task.sleep(for: .milliseconds(16))
        }
    }

    /// Stepped rather than animated: every level passes through the
    /// environment, so lights and keys wake in order.
    private func runBoot() async {
        boot = 0
        guard store.fold.isOpen else { return }
        guard !reduceMotion else { boot = 1; return }
        let start = Date.now
        let duration = 1.35
        while !Task.isCancelled {
            let t = Date.now.timeIntervalSince(start) / duration
            boot = min(t, 1)
            if t >= 1 { break }
            try? await Task.sleep(for: .milliseconds(16))
        }
    }
}

/// The open display: the flap's inside on the left, the stationary body on
/// the right, split at the Duo's fold.
struct InnerDisplay: View {
    let store: GameStore
    @Environment(\.dexPower) private var power
    @Environment(\.dynamicTypeSize) private var typeSize

    var body: some View {
        GeometryReader { proxy in
            let size = proxy.size
            let safe = proxy.safeAreaInsets
            let regions = proxy.deviceRegions
            if let fold = splitFold(regions.fold, size: size) {
                sideBySide(size: size, safe: safe, fold: fold, regions: regions)
            } else {
                stacked(size: size, safe: safe, camera: regions.camera)
            }
        }
        .ignoresSafeArea()
        .overlay(alignment: .bottomLeading) { developerMenu }
    }

    private func splitFold(_ fold: CGRect?, size: CGSize) -> CGRect? {
        if let fold, fold.height >= fold.width {
            let width = max(fold.width, 26)
            return CGRect(x: fold.midX - width / 2, y: 0, width: width, height: size.height)
        }
        guard fold == nil, size.width >= 700, size.height >= 560, !typeSize.isAccessibilitySize else { return nil }
        return CGRect(x: size.width / 2 - 13, y: 0, width: 26, height: size.height)
    }

    private var lights: (red: Bool, yellow: Bool, green: Bool) {
        // Booting runs the lights red → yellow → green; afterwards they follow the capture.
        if power < 1 { return (power > 0.08 && power < 0.45, power > 0.35 && power < 0.8, power > 0.7) }
        return (store.captureStage == .reveal, store.captureStage == .ball, true)
    }

    private func sideBySide(size: CGSize, safe: EdgeInsets, fold: CGRect, regions: DeviceRegions) -> some View {
        let bodyRect = CGRect(x: fold.maxX, y: 0, width: size.width - fold.maxX, height: size.height)
        // On a real fold the lens stays where the cover had it.
        let anchor = regions.fold == nil ? nil : (store.lensAnchor ?? .duo)
        let lens = anchor.map { LensGeometry(anchor: $0, panel: bodyRect) } ?? LensGeometry(camera: regions.camera, panel: bodyRect, safe: safe)
        // The flap and the body are separate slabs of plastic with the hinge
        // channel between them. Every edge the case has is rounded, including
        // where the halves meet the channel and the display's own edges, so
        // the shell reads as a moulded object rather than a cut-off fill.
        let barrelWidth = fold.width - 4
        let channelInset: CGFloat = 3
        let flapRight = fold.midX - barrelWidth / 2 - channelInset
        let bodyLeft = fold.midX + barrelWidth / 2 + channelInset
        let seam = lens.seam(hinge: bodyLeft, edge: size.width + 20)
        var flapEdge = lens.mirroredSeam(fold: fold, edge: 0)
        flapEdge[0].x = flapRight
        let flapOutline = flapEdge + [CGPoint(x: 0, y: size.height), CGPoint(x: flapRight, y: size.height)]
        let bodyOutline = [CGPoint(x: bodyLeft, y: 0), CGPoint(x: size.width, y: 0),
                           CGPoint(x: size.width, y: size.height), CGPoint(x: bodyLeft, y: size.height)]
        let top = lens.seamLow + 20
        let bottom = size.height - max(safe.bottom, 14) - 8
        let bodyContent = CGRect(x: fold.maxX + 22, y: top, width: size.width - max(safe.trailing, 0) - 22 - fold.maxX - 22, height: bottom - top)
        let flapContent = CGRect(x: max(safe.leading, 0) + 22, y: top, width: fold.minX - 22 - max(safe.leading, 0) - 22, height: bottom - top)
        let tab = CGPoint(x: (fold.minX + flapEdge[1].x) / 2, y: (lens.seamHigh + lens.seamLow) / 2 + 3)
        return ZStack(alignment: .topLeading) {
            Lining()
            ShellBackground().clipShape(Polyline(points: bodyOutline, closed: true, corner: 14))
            FlapPlastic(outline: flapOutline)
            // The lit edge wraps the flap's corners at the channel and the display edge.
            Polyline(points: [CGPoint(x: flapRight, y: lens.seamHigh + 16)] + flapEdge + [CGPoint(x: 0, y: lens.seamLow + 16)], corner: 12)
                .stroke(.white.opacity(0.35), lineWidth: 1.2).offset(y: 1)
            Polyline(points: seam, corner: 12).groove(2.5)
            // The barrel stands in the channel as far from the flap's top edge as
            // it stands from the display's bottom edge.
            let barrelTop = lens.seamHigh + 12
            let barrelBottom = size.height - 12
            HingeBarrel()
                .frame(width: barrelWidth, height: barrelBottom - barrelTop)
                .position(x: fold.midX, y: (barrelTop + barrelBottom) / 2)
            LensStrip(lens: lens, glow: power, lights: lights, glints: store.selectionGlints, flashes: store.scanFlashes)
            DotGrille(rows: 2, columns: 6, dot: 4, gap: 4).position(tab)
            // On the Duo the body always fills its half; only large type scrolls.
            fitting(BodyPanel(store: store, fill: true), scrolling: BodyPanel(store: store, fill: false))
                .frame(width: bodyContent.width, height: bodyContent.height)
                .position(x: bodyContent.midX, y: bodyContent.midY)
            fitting(FlapPanel(store: store, fill: true), scrolling: FlapPanel(store: store))
                .frame(width: flapContent.width, height: flapContent.height)
                .position(x: flapContent.midX, y: flapContent.midY)
            closeKey.padding(.leading, max(safe.leading, 0) + 18).padding(.top, max(safe.top, 10) + 6)
        }
        .frame(width: size.width, height: size.height)
    }

    private func stacked(size: CGSize, safe: EdgeInsets, camera: CGRect?) -> some View {
        let lens = LensGeometry(camera: camera, panel: CGRect(origin: .zero, size: size), safe: safe)
        return ScrollView {
            VStack(spacing: 0) {
                ZStack(alignment: .topLeading) {
                    ShellBackground()
                    Polyline(points: lens.seam(hinge: -20, edge: size.width + 20), corner: 12).groove(2.5)
                    LensStrip(lens: lens, glow: power, lights: lights, glints: store.selectionGlints, flashes: store.scanFlashes)
                    BodyPanel(store: store, fill: false)
                        .padding(.horizontal, 20).padding(.top, lens.seamLow + 20).padding(.bottom, 26)
                    closeKey.padding(.leading, 18).padding(.top, max(safe.top, 10) + 6)
                }
                HingeBarrel(vertical: false).frame(height: 22).padding(.horizontal, 26)
                    .frame(maxWidth: .infinity).background(Lining())
                FlapPanel(store: store)
                    .padding(.horizontal, 20).padding(.top, 24).padding(.bottom, max(safe.bottom, 16) + 20)
                    .background(ShellBackground())
            }
        }
        .scrollIndicators(.hidden)
        .background(Dex.redDark)
    }

    /// Fills the panel when it fits; scrolls at large text sizes.
    /// Fills the panel at normal text sizes; scrolls at accessibility sizes.
    /// (ViewThatFits would size the fixed layout to its ideal height, not the panel's.)
    @ViewBuilder private func fitting(_ fixed: some View, scrolling: some View) -> some View {
        if typeSize.isAccessibilitySize {
            ScrollView { scrolling.padding(.bottom, 12) }.scrollIndicators(.hidden)
        } else {
            fixed
        }
    }

    @ViewBuilder private var closeKey: some View {
        if store.fold.supportsManualOpening {
            Button { store.setManualOpen(false) } label: {
                Image(systemName: "arrow.right.to.line").font(.system(size: 13, weight: .bold))
            }
            .buttonStyle(KeyCapStyle(tint: .ink, depth: 5, corners: .all(12), wake: 0))
            .accessibilityLabel("Close case").accessibilityIdentifier("close-case")
        }
    }

    @ViewBuilder private var developerMenu: some View {
        #if DEBUG
        if ProcessInfo.processInfo.arguments.contains("--developer") {
            Menu {
                Button("Reset demo") { store.resetDemo() }
            } label: {
                Image(systemName: "wrench.adjustable").font(.caption).foregroundStyle(Dex.cream.opacity(0.4)).padding(14)
            }
        }
        #endif
    }
}

/// The recess the flap sits in when it is closed.
private struct Lining: View {
    var body: some View {
        LinearGradient(colors: [Dex.lining, Color(red: 0.1, green: 0.01, blue: 0.02)], startPoint: .top, endPoint: .bottom)
            .overlay(Grain().opacity(0.6))
            .accessibilityHidden(true)
    }
}
