import SwiftUI

/// The catch, played on the scanner in place of the Pokémon: a Poké Ball
/// is thrown in, draws the silhouette inside, wiggles three times, clicks
/// shut, then pops open so the Pokémon can come out.
///
/// Each beat follows `GameStore.captureStage`: `.reveal` is the throw,
/// `.ball` is the wiggle, and the change to `.caught` plays the opening.
/// The store sleeps for `throwDuration` and `wiggleDuration` between them.
/// Each beat's keyframes play once, triggered as the beat appears; a
/// `KeyframeAnimator` that isn't repeating otherwise holds its first frame.
struct CaptureSequence: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var opening = false

    static let throwDuration: Duration = .milliseconds(1250)
    static let wiggleDuration: Duration = .milliseconds(2600)

    var body: some View {
        // The ball is a third of the scanner, so it reads on the Duo and on an iPad.
        GeometryReader { proxy in
            let size = min(max(min(proxy.size.width, proxy.size.height) * 0.34, 84), 180)
            ZStack {
                switch store.captureStage {
                case .reveal: CaptureThrow(store: store, size: size).transition(.identity)
                case .ball: CaptureWiggle(size: size).transition(.identity)
                case .caught where opening: CaptureOpen(size: size).transition(.identity)
                default: EmptyView()
                }
            }
            .frame(width: proxy.size.width, height: proxy.size.height)
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
        .onChange(of: store.captureStage) { old, new in
            // Only a catch that was watched opens; a restored one is already out.
            guard new == .caught, old == .ball, !reduceMotion else { return }
            opening = true
        }
        .task(id: opening) {
            guard opening else { return }
            try? await Task.sleep(for: .milliseconds(900))
            opening = false
        }
    }
}

// MARK: - The throw: in on an arc, open, draw the Pokémon in, shut, drop

private struct ThrowFrame {
    var ball = CGPoint(x: -150, y: -120)
    var scale: Double = 0.35
    var spin: Double = -720
    var lid: Double = 0
    var beam: Double = 0
    var absorb: Double = 0
}

private struct CaptureThrow: View {
    @State private var started = false
    let store: GameStore
    let size: CGFloat
    var body: some View {
        KeyframeAnimator(initialValue: ThrowFrame(), trigger: started) { frame in
            ZStack {
                // The scanner's own silhouette flares white and shrinks up into the ball.
                PixelPokemon(store: store, revealed: false)
                .brightness(min(frame.absorb * 2, 0.6))
                .shadow(color: Dex.redLight.opacity(frame.beam), radius: 14)
                .padding(8)
                .scaleEffect(1 - 0.94 * frame.absorb)
                .offset(x: frame.ball.x * unit * frame.absorb, y: frame.ball.y * unit * frame.absorb)
                .opacity(1 - smoothstep(frame.absorb, 0.7, 1))
                // The red light the ball pulls it in with.
                Capsule().fill(LinearGradient(colors: [Dex.redLight.opacity(0.7), Dex.redLight.opacity(0)], startPoint: .top, endPoint: .bottom))
                    .frame(width: size * 0.73, height: size * 1.25)
                    .blur(radius: 10)
                    .offset(x: frame.ball.x * unit, y: (frame.ball.y + 60) * unit)
                    .opacity(frame.beam * (1 - frame.absorb))
                Pokeball(lid: frame.lid, glow: frame.beam)
                    .frame(width: size, height: size)
                    .rotationEffect(.degrees(frame.spin))
                    .scaleEffect(frame.scale)
                    .offset(x: frame.ball.x * unit, y: frame.ball.y * unit)
            }
        } keyframes: { _ in
            // Thrown in from the top left (in points for a 96-point ball), arcing over the Pokémon's head.
            KeyframeTrack(\.ball) {
                CubicKeyframe(CGPoint(x: -40, y: -150), duration: 0.22)
                CubicKeyframe(CGPoint(x: 0, y: -95), duration: 0.2)
                LinearKeyframe(CGPoint(x: 0, y: -95), duration: 0.5)
                // Then it falls to the floor and bounces once.
                CubicKeyframe(CGPoint(x: 0, y: 10), duration: 0.15)
                CubicKeyframe(CGPoint(x: 0, y: -8), duration: 0.09)
                CubicKeyframe(CGPoint(x: 0, y: 0), duration: 0.09)
            }
            KeyframeTrack(\.scale) {
                CubicKeyframe(0.7, duration: 0.42)
                LinearKeyframe(0.7, duration: 0.5)
                CubicKeyframe(1, duration: 0.3)
            }
            KeyframeTrack(\.spin) {
                CubicKeyframe(0, duration: 0.42)
            }
            KeyframeTrack(\.lid) {
                LinearKeyframe(0, duration: 0.42)
                SpringKeyframe(80, duration: 0.14, spring: .snappy)
                LinearKeyframe(80, duration: 0.24)
                SpringKeyframe(0, duration: 0.12, spring: .snappy)
            }
            KeyframeTrack(\.beam) {
                LinearKeyframe(0, duration: 0.46)
                CubicKeyframe(1, duration: 0.1)
                LinearKeyframe(1, duration: 0.24)
                CubicKeyframe(0, duration: 0.2)
            }
            KeyframeTrack(\.absorb) {
                LinearKeyframe(0, duration: 0.5)
                CubicKeyframe(1, duration: 0.3)
            }
        }
        .onAppear { started = true }
    }

    private var unit: CGFloat { size / 96 }
}

// MARK: - The wiggle: three rolls side to side on the floor, then the click

private struct WiggleFrame {
    /// How far the ball has rolled, in degrees; negative is to the left.
    var roll: Double = 0
    var glow: Double = 0.6
    var click: Double = 0
}

private struct CaptureWiggle: View {
    @State private var started = false
    let size: CGFloat
    var body: some View {
        KeyframeAnimator(initialValue: WiggleFrame(), trigger: started) { frame in
            ZStack {
                // Stars burst off the ball as it clicks.
                ForEach(0..<5, id: \.self) { index in
                    let angle = Angle.degrees(-90 + Double(index - 2) * 36)
                    Image(systemName: "star.fill")
                        .font(.system(size: size * 0.14, weight: .bold))
                        .foregroundStyle(Dex.yellow)
                        .shadow(color: Dex.yellow, radius: 4)
                        .offset(x: cos(angle.radians) * size * (0.42 + 0.36 * frame.click), y: sin(angle.radians) * size * (0.42 + 0.36 * frame.click))
                        .scaleEffect(frame.click > 0 ? 1 : 0.2)
                        .opacity(frame.click > 0 ? 1 - smoothstep(frame.click, 0.5, 1) : 0)
                }
                Pokeball(glow: frame.glow)
                    .frame(width: size, height: size)
                    // It rolls along the floor: as far across as its rim turns.
                    .rotationEffect(.degrees(frame.roll))
                    .offset(x: size / 2 * frame.roll * .pi / 180)
                    .scaleEffect(1 - 0.05 * sin(frame.click * .pi))
            }
        } keyframes: { _ in
            // Three shakes, each a pause, a roll left, a roll right, and a settle.
            KeyframeTrack(\.roll) {
                LinearKeyframe(0, duration: 0.24)
                CubicKeyframe(-28, duration: 0.11)
                CubicKeyframe(24, duration: 0.16)
                SpringKeyframe(0, duration: 0.16, spring: .bouncy)
                LinearKeyframe(0, duration: 0.24)
                CubicKeyframe(-28, duration: 0.11)
                CubicKeyframe(24, duration: 0.16)
                SpringKeyframe(0, duration: 0.16, spring: .bouncy)
                LinearKeyframe(0, duration: 0.24)
                CubicKeyframe(-28, duration: 0.11)
                CubicKeyframe(24, duration: 0.16)
                SpringKeyframe(0, duration: 0.16, spring: .bouncy)
            }
            // The button pulses red with each shake, then goes dark on the click.
            KeyframeTrack(\.glow) {
                LinearKeyframe(0.45, duration: 0.24)
                CubicKeyframe(1, duration: 0.2)
                CubicKeyframe(0.45, duration: 0.23)
                LinearKeyframe(0.45, duration: 0.24)
                CubicKeyframe(1, duration: 0.2)
                CubicKeyframe(0.45, duration: 0.23)
                LinearKeyframe(0.45, duration: 0.24)
                CubicKeyframe(1, duration: 0.2)
                CubicKeyframe(0.45, duration: 0.23)
                LinearKeyframe(0.45, duration: 0.04)
                CubicKeyframe(0, duration: 0.08)
            }
            KeyframeTrack(\.click) {
                LinearKeyframe(0, duration: 2.05)
                LinearKeyframe(0.01, duration: 0.01)
                CubicKeyframe(1, duration: 0.5)
            }
        }
        .onAppear { started = true }
    }
}

// MARK: - The opening: the lid flies back, a flash, and the Pokémon is out

private struct OpenFrame {
    var lid: Double = 0
    var flash: Double = 0
    var fade: Double = 0
}

private struct CaptureOpen: View {
    @State private var started = false
    let size: CGFloat
    var body: some View {
        KeyframeAnimator(initialValue: OpenFrame(), trigger: started) { frame in
            ZStack {
                Pokeball(lid: frame.lid)
                    .frame(width: size, height: size)
                    .scaleEffect(1 - 0.35 * frame.fade)
                    .offset(y: size * 0.4 * frame.fade)
                    .opacity(1 - frame.fade)
                Circle().fill(RadialGradient(colors: [.white, Dex.phosphor.opacity(0.6), .clear], center: .center, startRadius: 0, endRadius: size * 0.85))
                    .frame(width: size * 1.7, height: size * 1.7)
                    .scaleEffect(0.2 + 1.8 * frame.flash)
                    .opacity(frame.flash > 0 ? 1 - frame.flash : 0)
                    .blendMode(.plusLighter)
            }
        } keyframes: { _ in
            KeyframeTrack(\.lid) {
                SpringKeyframe(110, duration: 0.22, spring: .bouncy)
            }
            KeyframeTrack(\.flash) {
                LinearKeyframe(0, duration: 0.06)
                LinearKeyframe(0.01, duration: 0.01)
                CubicKeyframe(1, duration: 0.55)
            }
            KeyframeTrack(\.fade) {
                LinearKeyframe(0, duration: 0.25)
                CubicKeyframe(1, duration: 0.4)
            }
        }
        .onAppear { started = true }
    }
}
