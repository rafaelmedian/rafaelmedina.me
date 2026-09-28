import SwiftUI
import PocketDexCore

// MARK: - Body (the stationary half): scanner and control deck

struct BodyPanel: View {
    let store: GameStore
    /// When true the scanner grows to fill the panel; otherwise it keeps a fixed height.
    var fill = true
    var body: some View {
        VStack(spacing: 14) {
            Scanner(store: store)
                .frame(minHeight: 250, maxHeight: fill ? .infinity : 330)
            ControlDeck(store: store)
        }
    }
}

/// The cream bezel with its cut corner, holding the CRT.
private struct Scanner: View {
    let store: GameStore
    @Environment(\.dexPower) private var power
    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 10) {
                ForEach(0..<2, id: \.self) { _ in
                    Circle().fill(Dex.redDark).frame(width: 7, height: 7)
                        .overlay(Circle().stroke(.white.opacity(0.5), lineWidth: 1).offset(y: 0.8))
                }
            }.accessibilityHidden(true)
            CRTScreen(power: power, radius: 16) { ScannerPicture(store: store) }
            HStack(alignment: .center) {
                // The red dome sits inside the bezel, clear of the cut corner.
                ZStack {
                    Circle().fill(Dex.bezelShade.shadow(.inner(color: .black.opacity(0.35), radius: 2, y: 1)))
                        .frame(width: 30, height: 30)
                    Circle().fill(RadialGradient(colors: [Dex.redLight, Dex.red, Dex.redDark], center: UnitPoint(x: 0.4, y: 0.3), startRadius: 0, endRadius: 15))
                        .frame(width: 22, height: 22)
                        .shadow(color: Dex.redDark.opacity(0.6), radius: 0, y: 2)
                    Ellipse().fill(.white.opacity(0.6)).frame(width: 7, height: 4).offset(x: -4, y: -5)
                }
                .padding(.leading, 26)
                .accessibilityHidden(true)
                Spacer()
                VStack(spacing: 4) {
                    ForEach(0..<4, id: \.self) { _ in
                        Capsule().fill(Dex.bezelShade).frame(width: 46, height: 3.5)
                            .overlay(Capsule().fill(.black.opacity(0.35)).frame(height: 1.5).offset(y: -0.6))
                            .shadow(color: .white, radius: 0, y: 1)
                    }
                }.accessibilityHidden(true)
            }.padding(.horizontal, 6)
        }
        .padding(14)
        .background {
            let shape = BezelShape()
            shape.fill(LinearGradient(colors: [.white, Dex.bezel, Color(white: 0.84)], startPoint: .top, endPoint: .bottom))
                .overlay(shape.stroke(.white, lineWidth: 1.5).blendMode(.plusLighter).opacity(0.6).padding(1))
                .shadow(color: Dex.groove.opacity(0.55), radius: 0, y: 4)
                .shadow(color: .black.opacity(0.3), radius: 10, y: 8)
        }
    }
}

/// A rounded panel with the Pokédex's chamfered lower-left corner.
private struct BezelShape: Shape {
    func path(in rect: CGRect) -> Path {
        let r: CGFloat = 20
        let cut = min(rect.width, rect.height) * 0.13
        return Polyline(points: [
            CGPoint(x: rect.midX, y: rect.minY), CGPoint(x: rect.maxX, y: rect.minY),
            CGPoint(x: rect.maxX, y: rect.maxY), CGPoint(x: rect.minX + cut, y: rect.maxY),
            CGPoint(x: rect.minX, y: rect.maxY - cut), CGPoint(x: rect.minX, y: rect.minY)
        ], closed: true, corner: r).path(in: rect)
    }
}

private struct ScannerPicture: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        let revealed = store.game.round.revealed
        VStack(spacing: 6) {
            HStack {
                Text(revealed ? "SIGNAL IDENTIFIED" : "SCANNING…")
                Spacer()
                Text(revealed ? "No.\(store.pokemon.number)" : "No.???")
            }
            .font(.system(size: 11, weight: .bold, design: .monospaced)).tracking(1)
            .foregroundStyle(Dex.phosphor.opacity(0.75))
            ZStack {
                ForEach([0.95, 0.66], id: \.self) { scale in
                    Circle().stroke(Dex.phosphor.opacity(0.14), style: StrokeStyle(lineWidth: 1, dash: [2, 5]))
                        .scaleEffect(scale)
                }
                if store.captureStage == .ball {
                    Pokeball().frame(width: 84, height: 84).transition(.scale.combined(with: .opacity))
                } else if revealed {
                    Image(store.pokemon.asset).resizable().scaledToFit()
                        .shadow(color: .white.opacity(0.35), radius: 10)
                        .padding(8)
                        .transition(.opacity)
                } else {
                    Image(store.pokemon.asset).resizable().renderingMode(.template).scaledToFit()
                        .foregroundStyle(Dex.phosphor)
                        .shadow(color: Dex.phosphor.opacity(0.8), radius: 8)
                        .padding(8)
                        .phaseAnimator(reduceMotion ? [1.0] : [1.0, 0.82]) { view, phase in view.opacity(phase) }
                            animation: { _ in .easeInOut(duration: 1.3) }
                        .transition(.opacity)
                }
                if store.captureStage == .caught {
                    Image(systemName: "sparkles").font(.title).foregroundStyle(Dex.phosphor)
                        .shadow(color: Dex.phosphor, radius: 6)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
                }
            }
            .frame(maxHeight: .infinity)
            .animation(reduceMotion ? nil : Dex.reveal, value: store.captureStage)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(revealed ? store.pokemon.name : "Silhouette of an undiscovered Pokémon. Use the clue to identify it.")
            Text(revealed ? store.pokemon.name : "Who's that Pokémon?")
                .font(.system(.title3, design: .monospaced, weight: .bold))
                .foregroundStyle(Dex.phosphor)
                .shadow(color: Dex.phosphor.opacity(0.7), radius: 5)
                .lineLimit(1).minimumScaleFactor(0.6)
                .accessibilityIdentifier("pokemon-name")
            if revealed {
                Text(store.pokemon.type)
                    .font(.system(size: 10, weight: .semibold, design: .monospaced)).tracking(1.5)
                    .foregroundStyle(Dex.phosphor.opacity(0.6))
            }
            // Round feedback sits on the screen, where the player is looking.
            // The idle greeting says nothing new, so only real feedback shows.
            let idle = store.message == GameStore.idleMessage
            Text(store.message)
                .font(.system(.footnote, design: .monospaced, weight: .semibold))
                .foregroundStyle(Dex.yellow.opacity(0.9))
                .lineLimit(1).minimumScaleFactor(0.7)
                .opacity(idle ? 0 : 1)
                .accessibilityHidden(idle)
                .accessibilityIdentifier("round-feedback")
        }
        .padding(16)
    }
}

/// The right thumb's corner: two DS-style switches, a small Discoveries key,
/// and OK as the big primary button under the thumb.
private struct ControlDeck: View {
    let store: GameStore
    var body: some View {
        HStack(alignment: .center, spacing: 14) {
            VStack(alignment: .leading, spacing: 12) {
                MiniSwitch(label: "SOUND", on: !store.muted) { store.toggleMute() }
                    .accessibilityLabel(store.muted ? "Enable sound" : "Mute sound")
                MiniSwitch(label: "HAPTIC", on: store.hapticsOn) { store.toggleHaptics() }
                    .accessibilityLabel(store.hapticsOn ? "Turn off haptics" : "Turn on haptics")
            }
            Spacer(minLength: 0)
            VStack(spacing: 6) {
                Button { store.collectionVisible = true } label: {
                    Image(systemName: "square.grid.2x2.fill").font(.system(size: 15, weight: .bold))
                }
                .buttonStyle(KeyCapStyle(tint: .cream, depth: 5, corners: .all(12), wake: 0.78))
                .accessibilityLabel("Discoveries")
                .accessibilityIdentifier("show-collection")
                Text(String(format: "%02d/12", store.game.captured.count))
                    .font(.system(size: 11, weight: .heavy, design: .monospaced))
                    .foregroundStyle(Dex.cream.opacity(0.8))
                    .accessibilityLabel("\(store.game.captured.count) of 12 Pokémon discovered")
                    .accessibilityIdentifier("capture-count")
            }
            Button { store.confirm() } label: {
                VStack(spacing: 2) {
                    Image(systemName: store.game.round.revealed ? "arrow.right" : "checkmark").font(.system(size: 22, weight: .black))
                    Text(store.game.round.revealed ? "NEXT" : "OK").font(.system(size: 10, weight: .heavy, design: .rounded))
                }
            }
            .buttonStyle(ArcadeButtonStyle(tint: .yellow, armed: store.canConfirm, size: 100, wake: 0.85))
            .disabled(!store.canConfirm)
            .accessibilityLabel(store.game.round.revealed ? "Next Pokémon" : "Confirm answer")
            .accessibilityIdentifier("confirm-answer")
        }
    }
}

/// A small DS-style switch: a tiny shell-plastic button, its engraved name,
/// and a light that shows whether it is on.
private struct MiniSwitch: View {
    let label: String
    let on: Bool
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Circle().fill(on ? Color(red: 0.4, green: 1, blue: 0.45) : Dex.groove.opacity(0.6))
                    .frame(width: 6, height: 6)
                    .shadow(color: on ? .green : .clear, radius: 4)
                Capsule().fill(LinearGradient(colors: [Dex.redLight, Dex.red], startPoint: .top, endPoint: .bottom))
                    .overlay(Capsule().strokeBorder(.white.opacity(0.35), lineWidth: 1))
                    .frame(width: 34, height: 14)
                    .shadow(color: Dex.groove.opacity(0.55), radius: 0, y: 2)
                Text(label).font(.system(size: 10, weight: .heavy, design: .rounded)).tracking(1.2)
                    .foregroundStyle(Dex.cream.opacity(0.75))
            }
            .frame(minHeight: 30)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .animation(Dex.quick, value: on)
    }
}

/// One moulded cross that rocks toward the arm you press, like a real
/// D-pad, rather than four separate keys.
struct DPad: View {
    let move: (Direction) -> Void
    private let size: CGFloat = 120
    /// Visual arm width; the hit areas stay a full 44pt.
    private let thickness: CGFloat = 30
    @State private var pressed: Direction?
    @Environment(\.dexPower) private var power
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        let arm = size / 3
        let tilt = tiltOffset
        let cross = CrossShape(arm: arm, thickness: thickness, radius: 7)
        ZStack {
            // An even skirt all round, so every arm reads the same height.
            cross.fill(Dex.redDark).offset(y: 3)
                .shadow(color: Dex.groove.opacity(0.5), radius: 4, y: 4)
            ZStack {
                cross.fill(LinearGradient(colors: [Dex.redLight, Dex.red], startPoint: .top, endPoint: .bottom))
                cross.stroke(LinearGradient(colors: [.white.opacity(0.45), .clear], startPoint: .top, endPoint: .center), lineWidth: 1)
                if let pressed {
                    // The pressed arm drops into shadow.
                    RoundedRectangle(cornerRadius: 6).fill(Dex.groove.opacity(0.28))
                        .frame(width: thickness - 2, height: thickness - 2)
                        .offset(offset(pressed, arm))
                }
                Circle().fill(Dex.groove.opacity(0.18)).frame(width: thickness * 0.55)
                    .overlay(Circle().stroke(.white.opacity(0.25), lineWidth: 1).offset(y: 1))
                ForEach([Direction.up, .down, .left, .right], id: \.self) { direction in
                    // An engraved line along each arm, as on the DS.
                    Capsule().fill(Dex.groove.opacity(pressed == direction ? 0.6 : 0.4))
                        .frame(width: 2, height: arm * 0.34)
                        .shadow(color: .white.opacity(0.3), radius: 0, x: 0.8, y: 0.8)
                        .rotationEffect(.degrees(angle(direction) + 90))
                        .offset(offset(direction, arm * 1.02))
                }
            }
            .offset(x: tilt.width, y: tilt.height + (power < 0.5 ? 4 : 0))
            .rotation3DEffect(.degrees(pressed == nil ? 0 : 7), axis: axis, perspective: 0.6)
            .brightness(power < 0.5 ? -0.15 : 0)
            // Four invisible hit areas, one per arm.
            ForEach([Direction.up, .down, .left, .right], id: \.self) { direction in
                Button { move(direction) } label: { Color.clear.frame(width: arm + 6, height: arm + 6) }
                    .buttonStyle(ArmPress(direction: direction, pressed: $pressed))
                    .offset(offset(direction, arm))
                    .accessibilityLabel("Select \(String(describing: direction))")
            }
        }
        .frame(width: size + 8, height: size + 12)
        .opacity(isEnabled ? 1 : 0.7)
        .animation(reduceMotion ? nil : Dex.squeeze, value: pressed)
        .animation(reduceMotion ? nil : Dex.squeeze, value: power < 0.5)
    }

    private var tiltOffset: CGSize {
        guard let pressed else { return .zero }
        let o = offset(pressed, 2)
        return CGSize(width: o.width, height: o.height + 2)
    }
    private var axis: (x: CGFloat, y: CGFloat, z: CGFloat) {
        switch pressed {
        case .up: (1, 0, 0)
        case .down: (-1, 0, 0)
        case .left: (0, -1, 0)
        case .right: (0, 1, 0)
        case nil: (1, 0, 0)
        }
    }
    private func offset(_ direction: Direction, _ distance: CGFloat) -> CGSize {
        switch direction {
        case .up: CGSize(width: 0, height: -distance)
        case .down: CGSize(width: 0, height: distance)
        case .left: CGSize(width: -distance, height: 0)
        case .right: CGSize(width: distance, height: 0)
        }
    }
    /// Triangle points left by default.
    private func angle(_ direction: Direction) -> Double {
        switch direction {
        case .left: 0
        case .up: 90
        case .right: 180
        case .down: 270
        }
    }
}

private struct ArmPress: ButtonStyle {
    let direction: Direction
    @Binding var pressed: Direction?
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .contentShape(Rectangle())
            .onChange(of: configuration.isPressed) { _, isPressed in
                if isPressed { pressed = direction } else if pressed == direction { pressed = nil }
            }
    }
}

/// A plus sign with softened corners: arms `thickness` wide, reaching 1.5 `arm`.
struct CrossShape: Shape {
    var arm: CGFloat
    var thickness: CGFloat
    var radius: CGFloat
    func path(in rect: CGRect) -> Path {
        let c = CGPoint(x: rect.midX, y: rect.midY)
        let h = thickness / 2
        let l = arm * 1.5
        let points = [
            CGPoint(x: c.x - h, y: c.y - l), CGPoint(x: c.x + h, y: c.y - l), CGPoint(x: c.x + h, y: c.y - h),
            CGPoint(x: c.x + l, y: c.y - h), CGPoint(x: c.x + l, y: c.y + h), CGPoint(x: c.x + h, y: c.y + h),
            CGPoint(x: c.x + h, y: c.y + l), CGPoint(x: c.x - h, y: c.y + l), CGPoint(x: c.x - h, y: c.y + h),
            CGPoint(x: c.x - l, y: c.y + h), CGPoint(x: c.x - l, y: c.y - h), CGPoint(x: c.x - h, y: c.y - h)
        ]
        // Start mid-edge so every corner is softened.
        let start = CGPoint(x: c.x, y: c.y - l)
        return Polyline(points: [start] + Array(points[1...]) + [points[0]], closed: true, corner: radius).path(in: rect)
    }
}

// MARK: - Flap (the half that swings): clue, answers, confirm

struct FlapPanel: View {
    let store: GameStore
    var fill = false
    var body: some View {
        if store.collectionVisible {
            CollectionPanel(store: store).frame(maxHeight: fill ? .infinity : nil, alignment: .top)
        } else if store.game.isComplete {
            CompletedPanel(store: store).frame(maxHeight: fill ? .infinity : nil, alignment: .top)
        } else {
            AnswerPanel(store: store, fill: fill)
        }
    }
}

struct AnswerPanel: View {
    let store: GameStore
    /// Fill the flap: the D-pad settles into the bottom corner under the left thumb.
    var fill = false
    @Environment(\.dexPower) private var power
    @Environment(\.dynamicTypeSize) private var typeSize
    var body: some View {
        VStack(spacing: 16) {
            // A compact clue: sentence case and generous leading read faster than a wall of caps.
            CRTScreen(power: power, radius: 14) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("PROFESSOR'S CLUE").font(.system(size: 10, weight: .bold, design: .monospaced)).tracking(1.5)
                        .foregroundStyle(Dex.phosphor.opacity(0.55))
                    Typewriter(text: store.pokemon.clue)
                        .font(.system(.body, design: .monospaced, weight: .semibold))
                        .lineSpacing(3)
                        .foregroundStyle(Dex.phosphor)
                        .shadow(color: Dex.phosphor.opacity(0.5), radius: 3)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .frame(maxWidth: .infinity, alignment: .topLeading)
                .padding(.horizontal, 16).padding(.vertical, 14)
            }
            .fixedSize(horizontal: false, vertical: true)

            let columns = typeSize.isAccessibilitySize ? 1 : 2
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 10), count: columns), spacing: 10) {
                ForEach(Array(store.game.round.choices.enumerated()), id: \.offset) { index, id in
                    answer(index: index, id: id, columns: columns)
                }
            }

            if fill { Spacer(minLength: 0) }
            HStack(alignment: .bottom) {
                DPad { store.move($0) }.disabled(store.game.round.revealed)
                Spacer(minLength: 0)
                DotGrille(rows: 3, columns: 7, dot: 4, gap: 4).padding(.bottom, 10)
            }
        }
    }

    private func answer(index: Int, id: Int, columns: Int) -> some View {
        let fill = self.fill
        let rejected = store.game.round.rejected.contains(index)
        let selected = store.game.round.selection == index
        let name = Catalog.pokemon(id: id)!.name
        // Mist rounds the outside bottom corners of its outer keys.
        let bottomRow = index >= store.game.round.choices.count - columns
        let outerLeft = bottomRow && index % columns == 0
        let outerRight = bottomRow && index % columns == columns - 1
        // Each answer is its own plastic, like Mist's mood keys.
        let palette: [KeyTint] = [.green, .yellow, .purple, .blue]
        let tint: KeyTint = rejected ? .spent : palette[index % palette.count]
        return Button { store.select(index) } label: {
            HStack(spacing: 8) {
                KeyLegend(text: ["A", "B", "C", "D"][index], color: tint.legend)
                Text(name).font(.system(fill ? .title3 : .headline, design: .rounded, weight: .bold))
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 0)
                if rejected { Image(systemName: "xmark").font(.caption.bold()) }
            }.frame(maxWidth: .infinity, minHeight: fill ? 62 : 46)
        }
        .buttonStyle(KeyCapStyle(tint: tint, depth: 8,
                                 corners: .init(topLeading: 12, bottomLeading: outerLeft ? 30 : 12, bottomTrailing: outerRight ? 30 : 12, topTrailing: 12),
                                 latched: selected && !rejected, wake: 0.55 + Double(index) * 0.05))
        .disabled(rejected || store.game.round.revealed)
        .accessibilityLabel(name)
        .accessibilityValue(rejected ? "Incorrect" : selected ? "Selected" : "")
        .accessibilityAddTraits(selected ? .isSelected : [])
        .accessibilityIdentifier("answer-\(index)")
    }
}

/// Clue text arrives a character at a time; layout is reserved up front.
struct Typewriter: View {
    let text: String
    @State private var shown = Int.max
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        let visible = String(text.prefix(shown))
        let rest = String(text.dropFirst(min(shown, text.count)))
        Text("\(visible)\(Text(rest).foregroundStyle(.clear))")
            .accessibilityLabel(text)
            .task(id: text) {
                guard !reduceMotion else { shown = text.count; return }
                shown = 0
                do {
                    try await Task.sleep(for: .milliseconds(350))
                    for count in 1...max(text.count, 1) {
                        shown = count
                        try await Task.sleep(for: .milliseconds(24))
                    }
                } catch {
                    shown = text.count
                }
            }
    }
}
