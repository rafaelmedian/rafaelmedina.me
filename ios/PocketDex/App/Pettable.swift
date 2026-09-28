import SwiftUI
import PocketDexCore

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
    @State private var size: CGSize = .zero
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ZStack(alignment: .top) {
            content
                .scaleEffect(x: pressing ? 1.1 : 1, y: pressing ? 0.86 : 1, anchor: .bottom)
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
        // Simultaneous, so the pixels' own finger tracking doesn't swallow them.
        .simultaneousGesture(SpatialTapGesture().onEnded { value in
            store.poke(region: TouchRegion(value.location, in: size))
        })
        .simultaneousGesture(
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
        .onGeometryChange(for: CGSize.self) { $0.size } action: { size = $0 }
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
        if store.lastPokeSqueezed {
            return revealed ? squeezes(name)[store.pokes % 3] : "It squirms out of your grip."
        }
        guard revealed else {
            // Silhouettes answer where they're touched, without a name.
            if let region = store.lastPokeRegion, store.pokes.isMultiple(of: 2) { return shadowRegions[region]! }
            return shadows[store.pokes % shadows.count]
        }
        // Cycle through where it was touched, what it's made of, and its own cry.
        switch store.pokes % 3 {
        case 0: if let region = store.lastPokeRegion { return regionLine(region, name: name, pokes: store.pokes) }
        case 1: return TouchStyle(store.pokemon).line(name)
        default: break
        }
        let own = cries[store.pokemon.id, default: [TouchStyle(store.pokemon).line(name)]]
        return own[(store.pokes / 3) % own.count]
    }

    private static func squeezes(_ name: String) -> [String] {
        ["Squish! \(name)'s cheeks puff out.", "\(name) squishes and bounces back!", "\(name) makes a very squashed face."]
    }

    private static let shadowRegions: [TouchRegion: String] = [
        .head: "It ducks its head.", .cheek: "Squish. Soft cheeks, whoever it is.",
        .belly: "Something giggled…", .feet: "It shuffles its feet."
    ]

    private static func regionLine(_ region: TouchRegion, name: String, pokes: Int) -> String {
        let lines: [String]
        switch region {
        case .head: lines = ["You patted \(name)'s head.", "\(name) leans into the pat."]
        case .cheek: lines = ["Boop! Right on \(name)'s cheek.", "Squishy cheeks!"]
        case .belly: lines = ["\(name) giggles. Ticklish!", "Poke! Right in the tummy."]
        case .feet: lines = ["\(name) hops on the spot.", "Its toes curl up."]
        }
        return lines[(pokes / 3) % lines.count]
    }
}

/// Where a tap landed on the Pokémon, roughly: its head, a cheek, its
/// middle, or its feet.
enum TouchRegion: Hashable {
    case head, cheek, belly, feet

    init?(_ point: CGPoint, in size: CGSize) {
        guard size.width > 0, size.height > 0 else { return nil }
        let x = point.x / size.width, y = point.y / size.height
        if y < 0.36 { self = .head } else if y > 0.74 { self = .feet } else if abs(x - 0.5) > 0.17 { self = .cheek } else { self = .belly }
    }
}

/// How a Pokémon's body answers a touch, by its first type: the shader's
/// style, how firm it is to haptics, and what it feels like.
enum TouchStyle: Int {
    case jelly, fire, electric, water, ghost, psychic, ice, stone, grass

    init(_ pokemon: Pokemon) {
        let types = pokemon.type.split(separator: "/").map { $0.trimmingCharacters(in: .whitespaces) }
        if types.contains("GHOST") { self = .ghost; return }
        switch types.first ?? "" {
        case "FIRE": self = .fire
        case "ELECTRIC": self = .electric
        case "WATER": self = .water
        case "PSYCHIC": self = .psychic
        case "ICE": self = .ice
        case "ROCK", "GROUND", "STEEL": self = .stone
        case "GRASS", "BUG": self = .grass
        default: self = .jelly
        }
    }

    func line(_ name: String) -> String {
        switch self {
        case .jelly: "\(name) wobbles like jelly."
        case .fire: "Hot! \(name) is warm to the touch."
        case .electric: "Bzzt! A little static off \(name)."
        case .water: "Splish. \(name) is cool and wet."
        case .ghost: "Your finger went right through \(name)!"
        case .psychic: "\(name) knew you'd touch it there."
        case .ice: "Brr! \(name) is freezing."
        case .stone: "Tok tok. \(name) is hard as rock."
        case .grass: "\(name) smells like fresh leaves."
        }
    }

    /// Stone and electric feel sharp under the finger; water and jelly soft.
    var haptic: UIImpactFeedbackGenerator.FeedbackStyle {
        switch self {
        case .stone, .electric, .ice: .rigid
        case .jelly, .water, .ghost: .soft
        default: .light
        }
    }
}

// MARK: - The Pokémon under the finger

/// The Pokémon at full resolution behind the CRT's dot mask, bent by a
/// Metal shader under the finger, after Mist's squeezable face.
///
/// - A finger dents the picture and drags the part it holds; a tap sends a
///   ripple out from where it landed. Let go and the body shivers like jelly.
/// - A pinch draws its cheeks in (spread to stretch it). Squeeze hard, by
///   pinching or holding, and it dissolves a dot at a time into another
///   picture of itself: shiny artwork, then its Pokémon HOME renders.
/// - Its type sets the feel: fire shimmers, electric crackles, water ripples
///   hard, ghosts let the finger through, psychic floats, ice frosts,
///   stone barely gives, grass rustles. A haptic texture follows a drag.
struct PixelPokemon: View {
    let store: GameStore
    /// Identified Pokémon show their colours; before that, a phosphor silhouette.
    let revealed: Bool

    @State private var picture = 0
    @State private var previous: String?
    @State private var swapped = Date.distantPast
    @State private var press = 0.0
    @State private var finger = CGPoint.zero
    @State private var dragStart = CGPoint.zero
    @State private var drag = CGSize.zero
    @State private var squish = 0.0
    @State private var pinch = CGPoint.zero
    @State private var deepest = 0.0
    @State private var pinching = false
    @State private var ripples: [(point: CGPoint, start: Date)] = []
    @State private var wobble = 0.0
    @State private var released = Date.distantPast
    @State private var lastTick = CGPoint.zero
    @State private var active = false
    @State private var settle: Task<Void, Never>?
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        let pictures = Self.pictures(for: store.pokemon)
        let style = TouchStyle(store.pokemon)
        GeometryReader { proxy in
            let size = proxy.size
            TimelineView(.animation(paused: !active || reduceMotion)) { timeline in
                let now = timeline.date
                // The swap runs off the clock: each dot of the new picture arrives at its own moment.
                let dissolve = reduceMotion ? 1 : min(1, now.timeIntervalSince(swapped) / 0.5)
                ZStack {
                    if let previous, dissolve < 1 {
                        artwork(previous).visualEffect { [dissolve] view, _ in
                            view.colorEffect(ShaderLibrary.dotDissolve(.float(dissolve), .float(0)))
                        }
                    }
                    artwork(pictures[picture % pictures.count]).visualEffect { [dissolve] view, _ in
                        view.colorEffect(ShaderLibrary.dotDissolve(.float(dissolve < 1 ? dissolve : 1.01), .float(1)))
                    }
                }
                .frame(width: size.width, height: size.height)
                .modifier(SquishEffect(size: size, time: now.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: 1000),
                                       style: style, finger: finger, press: press, drag: elastic(drag),
                                       pinch: pinch, squish: squish,
                                       wobble: wobble, wobbleAge: now.timeIntervalSince(released),
                                       ripples: ripples.compactMap { ripple in
                                           let age = now.timeIntervalSince(ripple.start)
                                           return age < 1.4 ? [ripple.point.x, ripple.point.y, age] : nil
                                       }.flatMap { $0 },
                                       reduceMotion: reduceMotion))
            }
            .contentShape(Rectangle())
            .simultaneousGesture(touch(in: size, style: style))
            .simultaneousGesture(pinchGesture(in: size))
        }
        // A hard squeeze, by pinch or by holding, brings out another picture.
        .onChange(of: store.pokes) {
            guard store.lastPokeSqueezed, !store.lastPokeOverdone, pictures.count > 1 else { return }
            previous = pictures[picture % pictures.count]
            picture += 1
            swapped = .now
            wake(for: 0.6)
        }
        .onChange(of: store.pokemon.id) {
            picture = 0
            previous = nil
            swapped = .distantPast
        }
    }

    @ViewBuilder private func artwork(_ name: String) -> some View {
        if revealed {
            Image(name).resizable().interpolation(.high).scaledToFit()
                .shadow(color: .white.opacity(0.25), radius: 8)
        } else {
            Image(name).resizable().renderingMode(.template).interpolation(.high).scaledToFit()
                .foregroundStyle(Dex.phosphor)
                .shadow(color: Dex.phosphor.opacity(0.8), radius: 8)
        }
    }

    /// One finger: dent, drag, and a ripple where it lets go of a tap.
    private func touch(in size: CGSize, style: TouchStyle) -> some Gesture {
        DragGesture(minimumDistance: 0)
            .onChanged { value in
                // A second finger turns this into a pinch; the pinch owns the body then.
                guard !pinching else { return }
                if press == 0 {
                    dragStart = value.startLocation
                    lastTick = value.startLocation
                    finger = value.startLocation
                }
                wake(for: nil)
                withAnimation(reduceMotion ? nil : .interactiveSpring(response: 0.18, dampingFraction: 0.8)) {
                    press = 1
                    finger = value.location
                    drag = value.translation
                }
                // A haptic tick every so often along the drag, like a texture under the finger.
                let travelled = hypot(value.location.x - lastTick.x, value.location.y - lastTick.y)
                if travelled > 14, store.hapticsOn {
                    UIImpactFeedbackGenerator(style: style.haptic).impactOccurred(intensity: min(1, 0.35 + travelled / 60))
                    lastTick = value.location
                }
            }
            .onEnded { value in
                let moved = hypot(value.translation.width, value.translation.height)
                if moved < 10 { ripples = (ripples + [(value.location, .now)]).suffix(3) }
                wobble = min(1, 0.35 + moved / 120)
                released = .now
                wake(for: 1.6)
                withAnimation(reduceMotion ? nil : .spring(response: 0.5, dampingFraction: 0.32)) {
                    press = 0
                    drag = .zero
                }
            }
    }

    /// Two fingers: pinch in to squish its cheeks, spread to stretch it.
    private func pinchGesture(in size: CGSize) -> some Gesture {
        MagnifyGesture()
            .onChanged { value in
                if !pinching {
                    pinching = true
                    pinch = value.startLocation
                    withAnimation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.8)) {
                        press = 0
                        drag = .zero
                    }
                }
                let amount = min(max((1 - value.magnification) / 0.45, -0.7), 1)
                deepest = max(deepest, amount)
                wake(for: nil)
                withAnimation(reduceMotion ? nil : .interactiveSpring(response: 0.15, dampingFraction: 0.85)) { squish = amount }
            }
            .onEnded { _ in
                let squeezed = deepest > 0.5
                pinching = false
                wobble = min(1, abs(deepest) + 0.3)
                released = .now
                deepest = 0
                wake(for: 1.6)
                withAnimation(reduceMotion ? nil : .spring(response: 0.5, dampingFraction: 0.3)) { squish = 0 }
                if squeezed { store.poke(squeezed: true) }
            }
    }

    /// The held part follows the finger less the further it is pulled, like
    /// stretching something soft.
    private func elastic(_ drag: CGSize) -> CGSize {
        let length = hypot(drag.width, drag.height)
        let give = 1 / (1 + length / 70)
        return CGSize(width: drag.width * give, height: drag.height * give)
    }

    /// Keeps the timeline running while something is moving, then lets it rest.
    private func wake(for seconds: Double?) {
        active = true
        settle?.cancel()
        guard let seconds else { return }
        settle = Task {
            try? await Task.sleep(for: .seconds(seconds))
            if !Task.isCancelled { active = false }
        }
    }

    /// The artwork first, then each extra picture that is bundled.
    @MainActor private static func pictures(for pokemon: Pokemon) -> [String] {
        [pokemon.asset] + ["shiny", "home", "home-shiny"]
            .map { String(format: "picture-%03d-%@", pokemon.id, $0) }
            .filter { UIImage(named: $0) != nil }
    }
}

/// Applies the squish shader. Animatable, so springs on the touch values
/// reach the shader every frame.
private struct SquishEffect: ViewModifier, Animatable {
    let size: CGSize
    let time: Double
    let style: TouchStyle
    let finger: CGPoint
    var press: Double
    let drag: CGSize
    let pinch: CGPoint
    var squish: Double
    let wobble: Double
    let wobbleAge: Double
    let ripples: [Double]
    let reduceMotion: Bool

    nonisolated var animatableData: AnimatablePair<Double, Double> {
        get { AnimatablePair(press, squish) }
        set { press = newValue.first; squish = newValue.second }
    }

    func body(content: Content) -> some View {
        content.layerEffect(
            ShaderLibrary.pixelSquish(
                .float2(size), .float(time), .float(Float(style.rawValue)),
                .float2(finger), .float(press), .float2(drag),
                .float2(pinch), .float(squish),
                .float(reduceMotion ? 0 : wobble), .float(wobbleAge),
                // Never empty: an idle ring far in the past stands in for none.
                .floatArray(ripples.isEmpty ? [0, 0, 99] : ripples.map(Float.init))
            ),
            maxSampleOffset: CGSize(width: 80, height: 80)
        )
    }
}
