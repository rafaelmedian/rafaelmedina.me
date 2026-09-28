import SwiftUI

/// Touching the scanner reaches the Pokémon, the way Mist's face answers a
/// poke or a squeeze. A tap makes it hop, wobble, spark, and say something; a
/// press squashes it and it leans after your finger, springing back with an
/// overshoot on release. Poke too often and it asks you to be gentler. Before
/// it is identified, the silhouette reacts without giving its name away.
struct Pettable<Content: View>: View {
    let store: GameStore
    @ViewBuilder var content: Content

    @State private var pressing = false
    @State private var pull: CGSize = .zero
    @State private var hop: CGFloat = 0
    @State private var shakes = 0
    @State private var bursts = 0
    @State private var zoom: CGFloat = 1
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ZStack(alignment: .top) {
            content
                .scaleEffect(x: pressing ? 1.1 : 1, y: pressing ? 0.86 : 1, anchor: .bottom)
                .scaleEffect(zoom)
                .rotationEffect(.degrees(Double(pull.width) * 0.5), anchor: .bottom)
                .offset(x: pull.width, y: pull.height * 0.4 + hop)
                .keyframeAnimator(initialValue: 0.0, trigger: shakes) { view, angle in
                    view.rotationEffect(.degrees(angle), anchor: .bottom)
                } keyframes: { _ in
                    KeyframeTrack {
                        CubicKeyframe(-9, duration: 0.06)
                        CubicKeyframe(8, duration: 0.08)
                        CubicKeyframe(-6, duration: 0.08)
                        CubicKeyframe(4, duration: 0.08)
                        CubicKeyframe(0, duration: 0.1)
                    }
                }
            SparkBurst(trigger: bursts)
            if let reaction = store.reaction {
                Text(reaction)
                    .font(.system(.footnote, design: .monospaced, weight: .bold))
                    .foregroundStyle(Dex.glass)
                    .padding(.horizontal, 10).padding(.vertical, 5)
                    .background(Dex.phosphor, in: Capsule())
                    .shadow(color: Dex.phosphor.opacity(0.6), radius: 6)
                    .lineLimit(1).minimumScaleFactor(0.7)
                    .id(store.pokes)
                    .transition(.opacity.combined(with: .offset(y: 6)))
                    .accessibilityAddTraits(.updatesFrequently)
            }
        }
        .contentShape(Rectangle())
        // A tap pokes. A press held a moment squeezes, and dragging while held
        // pulls it; both leave scrolling alone on layouts that scroll.
        .onTapGesture { store.poke() }
        .gesture(
            LongPressGesture(minimumDuration: 0.25)
                .sequenced(before: DragGesture(minimumDistance: 0))
                .onChanged { value in
                    guard case .second(true, let drag) = value else { return }
                    if !pressing { store.touch() }
                    let limit: CGFloat = 28
                    let translation = drag?.translation ?? .zero
                    let target = CGSize(width: max(-limit, min(limit, translation.width * 0.3)),
                                        height: max(-limit, min(limit, translation.height * 0.3)))
                    withAnimation(reduceMotion ? nil : .interactiveSpring(response: 0.22, dampingFraction: 0.7)) {
                        pressing = true
                        pull = target
                    }
                }
                .onEnded { _ in
                    withAnimation(reduceMotion ? nil : .spring(response: 0.38, dampingFraction: 0.32)) {
                        pressing = false
                        pull = .zero
                    }
                    store.poke(squeezed: true)
                }
        )
        // Pinch to look closer; it settles back when you let go.
        .simultaneousGesture(
            MagnifyGesture()
                .onChanged { value in zoom = min(max(value.magnification, 1), 2.4) }
                .onEnded { _ in withAnimation(reduceMotion ? nil : .spring(response: 0.4, dampingFraction: 0.6)) { zoom = 1 } }
        )
        .animation(Dex.quick, value: store.reaction)
        .onChange(of: store.pokes) { react() }
        .task(id: store.pokes) {
            guard store.reaction != nil else { return }
            try? await Task.sleep(for: .seconds(1.8))
            guard !Task.isCancelled else { return }
            withAnimation(Dex.quick) { store.clearReaction() }
        }
    }

    private func react() {
        guard !reduceMotion else { return }
        if store.lastPokeOverdone {
            shakes += 1
        } else if !store.lastPokeSqueezed {
            withAnimation(.spring(response: 0.22, dampingFraction: 0.5)) { hop = -16 }
            Task {
                try? await Task.sleep(for: .milliseconds(140))
                withAnimation(.spring(response: 0.35, dampingFraction: 0.4)) { hop = 0 }
            }
        }
        bursts += 1
    }
}

/// A handful of phosphor sparks that pop up and fade.
private struct SparkBurst: View {
    let trigger: Int
    private struct Spark { var rise: CGFloat = 0; var opacity = 0.0; var scale: CGFloat = 0.4 }
    private let spread: [(x: CGFloat, symbol: String)] = [(-58, "sparkle"), (-20, "heart.fill"), (24, "sparkle"), (62, "star.fill")]
    var body: some View {
        ZStack {
            ForEach(Array(spread.enumerated()), id: \.offset) { index, spark in
                Image(systemName: spark.symbol)
                    .font(.system(size: index.isMultiple(of: 2) ? 14 : 11, weight: .bold))
                    .foregroundStyle(Dex.phosphor)
                    .shadow(color: Dex.phosphor, radius: 4)
                    .keyframeAnimator(initialValue: Spark(), trigger: trigger) { view, value in
                        view.offset(x: spark.x, y: 70 - value.rise).opacity(value.opacity).scaleEffect(value.scale)
                    } keyframes: { _ in
                        KeyframeTrack(\.rise) { CubicKeyframe(60 + CGFloat(index % 2) * 18, duration: 0.7) }
                        KeyframeTrack(\.opacity) {
                            LinearKeyframe(1, duration: 0.12)
                            LinearKeyframe(1, duration: 0.3)
                            LinearKeyframe(0, duration: 0.28)
                        }
                        KeyframeTrack(\.scale) {
                            SpringKeyframe(1.1, duration: 0.25)
                            LinearKeyframe(0.8, duration: 0.45)
                        }
                    }
            }
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }
}

/// What the Pokémon says back. Silhouettes never give their names away.
enum PokeLines {
    private static let cries: [Int: [String]] = [
        1: ["Bulba! The bulb puffs up.", "Bulbasaur leans into the pat."],
        4: ["Char! The tail flame flickers.", "Charmander grins, warm to the touch."],
        7: ["Squirtle! A tiny splash.", "It ducks into its shell… and peeks out."],
        25: ["Pika pika!", "Bzzt! Its cheeks sparked."],
        39: ["Jiggly~♪ Don't fall asleep.", "Jigglypuff puffs up, pleased."],
        52: ["Mrrow? Got any coins?", "Meowth purrs, then pretends it didn't."],
        54: ["Psy… yai?", "Psyduck clutches its head. Gently!"],
        72: ["*bloop*", "Tentacool wobbles like jelly."],
        94: ["Heh heh heh…", "Gengar vanished for a second. Rude."],
        129: ["*splash* *splash*", "Magikarp flops. Majestically."],
        133: ["Vee! Its tail wags.", "Eevee nuzzles the glass."],
        143: ["…zzz…", "Snorlax rolls over. Still asleep."]
    ]
    private static let shadows = ["The shadow wriggles.", "Something giggled…", "It dodged your finger!", "Hey, that tickles."]

    @MainActor static func line(for store: GameStore, overdone: Bool) -> String {
        let revealed = store.game.round.revealed
        let name = store.pokemon.name
        if overdone { return revealed ? "\(name) wants you to be gentler." : "Easy… you'll scare it off." }
        if store.lastPokeSqueezed { return revealed ? "\(name) squishes and bounces back!" : "It squirms out of your grip." }
        let lines = revealed ? cries[store.pokemon.id, default: ["\(name) looks pleased."]] : shadows
        return lines[store.pokes % lines.count]
    }
}
