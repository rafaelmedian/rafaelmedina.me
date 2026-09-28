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
        .simultaneousGesture(TapGesture().onEnded { store.poke() })
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

// MARK: - The Pokémon as pixels

/// The Pokémon drawn as the scanner's own pixels, after Mist's squeezable
/// face. A finger dents the pixels under it; a pinch squishes its cheeks
/// together (spread your fingers and it stretches). Squeeze it hard enough,
/// by pinching or holding, and it dissolves into another picture of itself:
/// its shiny artwork, then its Pokémon HOME renders.
struct PixelPokemon: View {
    let store: GameStore
    /// Identified Pokémon show their colours; before that, a phosphor silhouette.
    let revealed: Bool

    @State private var picture = 0
    @State private var previous: PixelBitmap?
    @State private var dissolve = 1.0
    @State private var press = 0.0
    @State private var pressPoint = CGPoint(x: 0.5, y: 0.5)
    @State private var squish = 0.0
    @State private var squishCenter = CGPoint(x: 0.5, y: 0.45)
    @State private var deepest = 0.0
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        let pictures = PixelBitmap.pictures(for: store.pokemon)
        GeometryReader { proxy in
            let size = proxy.size
            PixelField(bitmap: pictures[picture % pictures.count], previous: previous,
                       tint: revealed ? nil : Dex.phosphor,
                       press: press, pressPoint: pressPoint,
                       squish: squish, squishCenter: squishCenter, dissolve: dissolve)
                .shadow(color: revealed ? .white.opacity(0.25) : Dex.phosphor.opacity(0.7), radius: revealed ? 8 : 7)
                .contentShape(Rectangle())
                // A finger dents the pixels under it and they spring back after.
                .simultaneousGesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            let point = unit(value.location, in: size)
                            if press == 0 { pressPoint = point }
                            withAnimation(reduceMotion ? nil : .interactiveSpring(response: 0.2, dampingFraction: 0.8)) {
                                press = 1
                                pressPoint = point
                            }
                        }
                        .onEnded { _ in
                            withAnimation(reduceMotion ? nil : .spring(response: 0.45, dampingFraction: 0.35)) { press = 0 }
                        }
                )
                // Pinch in to squish its cheeks; spread to stretch it.
                .simultaneousGesture(
                    MagnifyGesture()
                        .onChanged { value in
                            if squish == 0 { squishCenter = unit(value.startLocation, in: size) }
                            let amount = min(max((1 - value.magnification) / 0.45, -0.7), 1)
                            deepest = max(deepest, amount)
                            withAnimation(reduceMotion ? nil : .interactiveSpring(response: 0.15, dampingFraction: 0.85)) { squish = amount }
                        }
                        .onEnded { _ in
                            let squeezed = deepest > 0.5
                            deepest = 0
                            withAnimation(reduceMotion ? nil : .spring(response: 0.5, dampingFraction: 0.3)) { squish = 0 }
                            if squeezed { store.poke(squeezed: true) }
                        }
                )
        }
        // A hard squeeze, by pinch or by holding, brings out another picture.
        .onChange(of: store.pokes) {
            guard store.lastPokeSqueezed, !store.lastPokeOverdone, pictures.count > 1 else { return }
            previous = pictures[picture % pictures.count]
            picture += 1
            dissolve = 0
            withAnimation(reduceMotion ? nil : .easeOut(duration: 0.45)) { dissolve = 1 }
        }
        .onChange(of: store.pokemon.id) {
            picture = 0
            previous = nil
            dissolve = 1
        }
    }

    private func unit(_ point: CGPoint, in size: CGSize) -> CGPoint {
        CGPoint(x: point.x / max(size.width, 1), y: point.y / max(size.height, 1))
    }
}

/// Draws a bitmap as square pixels, displaced by the finger and the pinch.
/// Animatable, so springs on the touch values redraw every frame.
private struct PixelField: View, Animatable {
    let bitmap: PixelBitmap
    let previous: PixelBitmap?
    let tint: Color?
    var press: Double
    let pressPoint: CGPoint
    var squish: Double
    let squishCenter: CGPoint
    var dissolve: Double

    nonisolated var animatableData: AnimatablePair<AnimatablePair<Double, Double>, Double> {
        get { AnimatablePair(AnimatablePair(press, squish), dissolve) }
        set { press = newValue.first.first; squish = newValue.first.second; dissolve = newValue.second }
    }

    var body: some View {
        Canvas { context, size in
            // Mid-swap, each pixel flips from the old picture to the new at its
            // own moment, so the change reads as a dither, not a crossfade.
            if let previous, dissolve < 1 {
                draw(previous, in: &context, size: size) { $0 >= dissolve }
            }
            draw(bitmap, in: &context, size: size) { dissolve >= 1 || $0 < dissolve }
        }
        .accessibilityHidden(true)
    }

    private func draw(_ bitmap: PixelBitmap, in context: inout GraphicsContext, size: CGSize, when visible: (Double) -> Bool) {
        let side = min(size.width, size.height)
        let cell = side / CGFloat(bitmap.side)
        let origin = CGPoint(x: (size.width - side) / 2, y: (size.height - side) / 2)
        // Touch points arrive in the view's unit space; map them into the square.
        let finger = CGPoint(x: (pressPoint.x * size.width - origin.x) / side, y: (pressPoint.y * size.height - origin.y) / side)
        let pinch = CGPoint(x: (squishCenter.x * size.width - origin.x) / side, y: (squishCenter.y * size.height - origin.y) / side)
        for (index, color) in bitmap.pixels.enumerated() {
            guard let color, visible(bitmap.noise[index]) else { continue }
            var x = (Double(index % bitmap.side) + 0.5) / Double(bitmap.side)
            var y = (Double(index / bitmap.side) + 0.5) / Double(bitmap.side)
            var width = 1.0, height = 1.0
            // The pinch draws the cheeks in toward its centre line and lets the
            // pixels bulge up and down, fading with distance from the fingers.
            if squish != 0 {
                let dx = x - pinch.x, dy = y - pinch.y
                let reach = exp(-(dx * dx + dy * dy) / (2 * 0.3 * 0.3))
                let amount = squish * reach
                x = pinch.x + dx * (1 - 0.45 * amount)
                y = pinch.y + dy * (1 + 0.2 * amount)
                width = 1 - 0.35 * amount
                height = 1 + 0.25 * amount
            }
            // The finger pushes pixels out of its way, like pressing into dough.
            if press > 0 {
                let dx = x - finger.x, dy = y - finger.y
                let distance = max(sqrt(dx * dx + dy * dy), 0.001)
                let push = press * 0.07 * exp(-(distance * distance) / (2 * 0.14 * 0.14))
                x += dx / distance * push
                y += dy / distance * push
            }
            let w = cell * 0.86 * width, h = cell * 0.86 * height
            let rect = CGRect(x: origin.x + x * side - w / 2, y: origin.y + y * side - h / 2, width: w, height: h)
            context.fill(Path(rect), with: .color(tint ?? color))
        }
    }
}

/// A picture sampled down to a square grid: one entry per cell, nil where
/// it is transparent. The grid is fine enough to read as the CRT's own dots
/// rather than as chunky pixel art.
struct PixelBitmap {
    let side: Int
    let pixels: [Color?]
    /// A fixed random value per cell, for dissolving between pictures.
    let noise: [Double]

    /// Cells across the grid.
    static let side = 112

    /// The artwork first, then each extra picture that is bundled.
    @MainActor static func pictures(for pokemon: Pokemon) -> [PixelBitmap] {
        if let cached = cache[pokemon.id] { return cached }
        let names = [pokemon.asset] + ["shiny", "home", "home-shiny"].map {
            String(format: "picture-%03d-%@", pokemon.id, $0)
        }
        let pictures = names.compactMap { name in UIImage(named: name).flatMap(sample) }
        let result = pictures.isEmpty ? [PixelBitmap(side: 1, pixels: [nil], noise: [0])] : pictures
        cache[pokemon.id] = result
        return result
    }

    @MainActor private static var cache: [Int: [PixelBitmap]] = [:]

    /// Crops to the opaque pixels, then fits them into a square grid.
    private static func sample(_ image: UIImage) -> PixelBitmap? {
        guard let cg = image.cgImage, let full = rgba(cg, width: cg.width, height: cg.height, smooth: false) else { return nil }
        var minX = cg.width, minY = cg.height, maxX = -1, maxY = -1
        for y in 0..<cg.height {
            for x in 0..<cg.width where full[(y * cg.width + x) * 4 + 3] > 127 {
                minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y)
            }
        }
        guard maxX >= minX, maxY >= minY else { return nil }
        let span = max(maxX - minX + 1, maxY - minY + 1)
        // Centre the crop in a square, sitting on the bottom edge.
        let crop = CGRect(x: minX - (span - (maxX - minX + 1)) / 2, y: maxY + 1 - span, width: span, height: span)
        guard let cropped = cg.cropping(to: crop.intersection(CGRect(x: 0, y: 0, width: cg.width, height: cg.height))),
              let small = rgba(cropped, width: side, height: side, smooth: true, frame: crop, source: cg) else { return nil }
        var pixels = [Color?](repeating: nil, count: side * side)
        var noise = [Double](repeating: 0, count: side * side)
        var seed: UInt64 = 0x9E3779B97F4A7C15
        for index in 0..<(side * side) {
            seed = seed &* 6364136223846793005 &+ 1442695040888963407
            noise[index] = Double(seed >> 11) / Double(1 << 53)
            let alpha = small[index * 4 + 3]
            guard alpha > 110 else { continue }
            // Premultiplied: undo it so edge pixels keep their colour.
            let scale = 255 / Double(alpha)
            pixels[index] = Color(red: Double(small[index * 4]) * scale / 255,
                                  green: Double(small[index * 4 + 1]) * scale / 255,
                                  blue: Double(small[index * 4 + 2]) * scale / 255)
        }
        return PixelBitmap(side: side, pixels: pixels, noise: noise)
    }

    /// Draws an image into an RGBA buffer. With a frame, the crop is placed
    /// where it sat inside that frame, so a crop clipped at the edge keeps
    /// its offset.
    private static func rgba(_ image: CGImage, width: Int, height: Int, smooth: Bool,
                             frame: CGRect? = nil, source: CGImage? = nil) -> [UInt8]? {
        var buffer = [UInt8](repeating: 0, count: width * height * 4)
        let drawn = buffer.withUnsafeMutableBytes { bytes -> Bool in
            guard let context = CGContext(data: bytes.baseAddress, width: width, height: height, bitsPerComponent: 8,
                                          bytesPerRow: width * 4, space: CGColorSpaceCreateDeviceRGB(),
                                          bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return false }
            context.interpolationQuality = smooth ? .high : .none
            var rect = CGRect(x: 0, y: 0, width: width, height: height)
            if let frame, let source {
                // Where the clipped crop sits within the requested square, flipped for Core Graphics.
                let visible = frame.intersection(CGRect(x: 0, y: 0, width: source.width, height: source.height))
                let scale = CGFloat(width) / frame.width
                rect = CGRect(x: (visible.minX - frame.minX) * scale,
                              y: (frame.maxY - visible.maxY) * scale,
                              width: visible.width * scale, height: visible.height * scale)
            }
            context.draw(image, in: rect)
            return true
        }
        return drawn ? buffer : nil
    }
}
