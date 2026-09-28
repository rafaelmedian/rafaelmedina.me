import SwiftUI

struct PocketDexView: View {
    let store: GameStore
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    /// A timed power-on that runs each time the case opens. The hinge angle
    /// caps it, so a slow unfold wakes the Pokédex as it opens.
    @State private var boot = 0.0
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
        .environment(\.dexPower, power)
        .background(Dex.ink.ignoresSafeArea())
        .statusBarHidden(true)
        .persistentSystemOverlays(.hidden)
        .animation(reduceMotion ? nil : Dex.quick, value: store.fold.isOpen)
        .modifier(FoldObserver(store: store))
        .task(id: presentationID) {
            if presenting { await store.presentCapture(reduceMotion: reduceMotion) }
        }
        .task(id: store.fold.isOpen) { await runBoot() }
        .onChange(of: scenePhase) { _, next in
            if next != .active { store.stopFeedback() }
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
        // On a real fold the lens stays where the cover had it; the inner
        // camera gets its own sensor window on the strip.
        let anchor = regions.fold == nil ? nil : (store.lensAnchor ?? .duo)
        let lens = anchor.map { LensGeometry(anchor: $0, panel: bodyRect) } ?? LensGeometry(camera: regions.camera, panel: bodyRect, safe: safe)
        let lensRect = CGRect(x: lens.center.x - lens.radius, y: lens.center.y - lens.radius, width: lens.diameter, height: lens.diameter)
        let sensors = regions.sensors.filter { !$0.intersects(lensRect) }
        let seam = lens.seam(hinge: fold.maxX - 4, edge: size.width + 20)
        let flapEdge = lens.mirroredSeam(fold: fold, edge: -20)
        let flapOutline = flapEdge + [CGPoint(x: -20, y: size.height + 20), CGPoint(x: fold.minX, y: size.height + 20)]
        let top = lens.seamLow + 20
        let bottom = size.height - max(safe.bottom, 14) - 8
        let bodyContent = CGRect(x: fold.maxX + 22, y: top, width: size.width - max(safe.trailing, 0) - 22 - fold.maxX - 22, height: bottom - top)
        let flapContent = CGRect(x: max(safe.leading, 0) + 22, y: top, width: fold.minX - 22 - max(safe.leading, 0) - 22, height: bottom - top)
        let tab = CGPoint(x: (fold.minX + flapEdge[1].x) / 2, y: (lens.seamHigh + lens.seamLow) / 2 + 3)
        return ZStack(alignment: .topLeading) {
            ShellBackground()
            Lining().frame(width: fold.midX, height: size.height)
            FlapPlastic(outline: flapOutline)
            Polyline(points: flapEdge, corner: 12).stroke(.white.opacity(0.35), lineWidth: 1.2).offset(y: 1)
            Polyline(points: seam, corner: 12).groove(2.5)
            // A soft recess the spine sits in, then the spine itself.
            RoundedRectangle(cornerRadius: 10, style: .continuous).fill(Dex.groove.opacity(0.55))
                .frame(width: fold.width + 4, height: size.height - lens.seamHigh + 4)
                .position(x: fold.midX, y: (lens.seamHigh + size.height) / 2 - 4)
                .blur(radius: 2)
            HingeBarrel()
                .frame(width: fold.width - 2, height: size.height - lens.seamHigh - 4)
                .position(x: fold.midX, y: (lens.seamHigh + size.height) / 2 - 4)
            ForEach(Array(sensors.enumerated()), id: \.offset) { _, rect in SensorWindow(rect: rect) }
            LensStrip(lens: lens, glow: power, lights: lights, glints: store.selectionGlints, flashes: store.scanFlashes)
            DotGrille(rows: 2, columns: 6, dot: 4, gap: 4).position(tab)
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
    private func fitting(_ fixed: some View, scrolling: some View) -> some View {
        ViewThatFits(in: .vertical) {
            fixed
            ScrollView { scrolling.padding(.bottom, 12) }.scrollIndicators(.hidden)
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
