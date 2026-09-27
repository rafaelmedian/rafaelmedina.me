import SwiftUI
import PocketDexCore

// MARK: - Body (the stationary half): scanner and control deck

struct BodyPanel: View {
    let store: GameStore
    /// When true the scanner grows to fill the panel; otherwise it keeps a fixed height.
    var fill = true
    var body: some View {
        VStack(spacing: 18) {
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
                DotGrille(rows: 3, columns: 6, dot: 4, gap: 4, color: Dex.bezelShade)
                Spacer()
                Circle().fill(RadialGradient(colors: [Dex.redLight, Dex.red, Dex.redDark], center: UnitPoint(x: 0.4, y: 0.3), startRadius: 0, endRadius: 18))
                    .frame(width: 26, height: 26)
                    .shadow(color: Dex.redDark.opacity(0.6), radius: 0, y: 2.5)
                    .accessibilityHidden(true)
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

/// A rounded panel with the Pokédex's chamfered lower corner.
private struct BezelShape: Shape {
    func path(in rect: CGRect) -> Path {
        let r: CGFloat = 20
        let cut = min(rect.width, rect.height) * 0.16
        return Polyline(points: [
            CGPoint(x: rect.midX, y: rect.minY), CGPoint(x: rect.maxX, y: rect.minY),
            CGPoint(x: rect.maxX, y: rect.maxY - cut), CGPoint(x: rect.maxX - cut, y: rect.maxY),
            CGPoint(x: rect.minX, y: rect.maxY), CGPoint(x: rect.minX, y: rect.minY)
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
            Text(revealed ? store.pokemon.type : "SCAN • GUESS • DISCOVER")
                .font(.system(size: 10, weight: .semibold, design: .monospaced)).tracking(1.5)
                .foregroundStyle(Dex.phosphor.opacity(0.6))
        }
        .padding(16)
    }
}

/// D-pad, counter, and the sound knob, mirrored from the classic layout so the
/// D-pad sits by the hinge.
private struct ControlDeck: View {
    let store: GameStore
    @State private var wrongFlash = false
    var body: some View {
        HStack(alignment: .center, spacing: 16) {
            DPad { store.move($0) }.disabled(store.game.round.revealed)
            Spacer(minLength: 0)
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 8) {
                    IndicatorPill(color: Color(red: 1, green: 0.3, blue: 0.3), lit: wrongFlash)
                    IndicatorPill(color: Color(red: 0.4, green: 0.75, blue: 1), lit: store.canConfirm && !store.game.round.revealed)
                }
                LCD {
                    HStack(alignment: .firstTextBaseline, spacing: 3) {
                        Text(String(format: "%02d", store.game.captured.count)).font(.system(size: 28, weight: .semibold, design: .monospaced))
                        Text("/12").font(.system(size: 12, weight: .semibold, design: .monospaced))
                    }
                }
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("\(store.game.captured.count) of 12 Pokémon discovered")
                .accessibilityIdentifier("capture-count")
            }
            Spacer(minLength: 0)
            Button { store.toggleMute() } label: {
                Image(systemName: store.muted ? "speaker.slash.fill" : "speaker.wave.2.fill")
                    .font(.system(size: 15, weight: .bold)).frame(width: 34, height: 34)
            }
            .buttonStyle(KeyCapStyle(tint: .ink, depth: 6, corners: .all(40), wake: 0.62))
            .accessibilityLabel(store.muted ? "Enable sound" : "Mute sound")
        }
        .onChange(of: store.wrongAnswers) {
            wrongFlash = true
            Task { try? await Task.sleep(for: .milliseconds(700)); wrongFlash = false }
        }
    }
}

private struct IndicatorPill: View {
    let color: Color
    let lit: Bool
    var body: some View {
        Capsule().fill(lit ? color : color.opacity(0.35))
            .overlay(Capsule().fill(.black.opacity(lit ? 0 : 0.35)))
            .overlay(Capsule().stroke(.white.opacity(0.45), lineWidth: 1).padding(1))
            .frame(width: 34, height: 9)
            .padding(2.5)
            .background(Dex.groove, in: Capsule())
            .shadow(color: lit ? color.opacity(0.9) : .clear, radius: 6)
            .animation(Dex.quick, value: lit)
            .accessibilityHidden(true)
    }
}

struct DPad: View {
    let move: (Direction) -> Void
    private let arm: CGFloat = 44
    var body: some View {
        VStack(spacing: 0) {
            key(.up, "chevron.up", corners: .init(topLeading: 10, bottomLeading: 2, bottomTrailing: 2, topTrailing: 10))
            HStack(spacing: 0) {
                key(.left, "chevron.left", corners: .init(topLeading: 10, bottomLeading: 10, bottomTrailing: 2, topTrailing: 2))
                RoundedRectangle(cornerRadius: 3).fill(KeyTint.ink.face)
                    .overlay(Circle().fill(.black.opacity(0.35)).padding(12).shadow(color: .white.opacity(0.12), radius: 0, y: 1))
                    .frame(width: arm, height: arm)
                    .padding(.bottom, 5)
                    .accessibilityHidden(true)
                key(.right, "chevron.right", corners: .init(topLeading: 2, bottomLeading: 2, bottomTrailing: 10, topTrailing: 10))
            }
            key(.down, "chevron.down", corners: .init(topLeading: 2, bottomLeading: 10, bottomTrailing: 10, topTrailing: 2))
        }
        .padding(8)
        .background(Circle().fill(Dex.groove.opacity(0.35)).blur(radius: 1))
    }
    private func key(_ direction: Direction, _ symbol: String, corners: RectangleCornerRadii) -> some View {
        Button { move(direction) } label: {
            Image(systemName: symbol).font(.system(size: 12, weight: .black)).frame(width: arm - 24, height: arm - 20)
        }
        .buttonStyle(KeyCapStyle(tint: .ink, depth: 5, corners: corners, wake: 0.5))
        .accessibilityLabel("Select \(String(describing: direction))")
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
    /// Fill the flap: the clue screen takes whatever height the keys leave.
    var fill = false
    @Environment(\.dexPower) private var power
    @Environment(\.dynamicTypeSize) private var typeSize
    var body: some View {
        VStack(spacing: 16) {
            CRTScreen(power: power, radius: 14) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("PROFESSOR'S CLUE").font(.system(size: 10, weight: .bold, design: .monospaced)).tracking(1.5)
                        .foregroundStyle(Dex.phosphor.opacity(0.6))
                    Typewriter(text: store.pokemon.clue.uppercased())
                        .font(.system(fill ? .title3 : .callout, design: .monospaced, weight: .semibold))
                        .lineSpacing(4)
                        .foregroundStyle(Dex.phosphor)
                        .shadow(color: Dex.phosphor.opacity(0.6), radius: 4)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .frame(maxWidth: .infinity, maxHeight: fill ? .infinity : nil, alignment: .topLeading)
                .padding(16)
            }
            .fixedSize(horizontal: false, vertical: !fill)
            .frame(minHeight: fill ? 120 : nil)

            let columns = typeSize.isAccessibilitySize ? 1 : 2
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 10), count: columns), spacing: 10) {
                ForEach(Array(store.game.round.choices.enumerated()), id: \.offset) { index, id in
                    answer(index: index, id: id, columns: columns)
                }
            }

            HStack(alignment: .center, spacing: 16) {
                Button { store.confirm() } label: {
                    VStack(spacing: 2) {
                        Image(systemName: store.game.round.revealed ? "arrow.right" : "checkmark").font(.system(size: 18, weight: .black))
                        Text(store.game.round.revealed ? "NEXT" : "OK").font(.system(size: 9, weight: .heavy, design: .rounded))
                    }
                }
                .buttonStyle(ArcadeButtonStyle(tint: .yellow, armed: store.canConfirm, size: 92, wake: 0.85))
                .disabled(!store.canConfirm)
                .accessibilityLabel(store.game.round.revealed ? "Next Pokémon" : "Confirm answer")
                .accessibilityIdentifier("confirm-answer")

                VStack(alignment: .leading, spacing: 10) {
                    Readout {
                        Text(store.message)
                            .font(.system(.caption, design: .monospaced, weight: .bold))
                            .foregroundStyle(Dex.phosphor)
                            .fixedSize(horizontal: false, vertical: true)
                            .accessibilityIdentifier("round-feedback")
                    }
                    Button { store.collectionVisible = true } label: {
                        HStack(spacing: 8) {
                            Image(systemName: "square.grid.2x2.fill").font(.caption)
                            Text("Discoveries").font(.system(.subheadline, design: .rounded, weight: .bold))
                            Spacer(minLength: 4)
                            Text("\(store.game.captured.count)/12").font(.system(.caption, design: .monospaced, weight: .bold))
                        }
                    }
                    .buttonStyle(KeyCapStyle(tint: .cream, depth: 6, corners: .all(12), wake: 0.78))
                    .accessibilityIdentifier("show-collection")
                }
            }
        }
    }

    private func answer(index: Int, id: Int, columns: Int) -> some View {
        let rejected = store.game.round.rejected.contains(index)
        let selected = store.game.round.selection == index
        let name = Catalog.pokemon(id: id)!.name
        // Mist rounds the outside bottom corners of its outer keys.
        let bottomRow = index >= store.game.round.choices.count - columns
        let outerLeft = bottomRow && index % columns == 0
        let outerRight = bottomRow && index % columns == columns - 1
        let tint: KeyTint = rejected ? .spent : .blue
        return Button { store.select(index) } label: {
            HStack(spacing: 8) {
                KeyLegend(text: ["A", "B", "C", "D"][index], color: tint.legend)
                Text(name).font(.system(.subheadline, design: .rounded, weight: .bold))
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 0)
                if rejected { Image(systemName: "xmark").font(.caption.bold()) }
            }.frame(maxWidth: .infinity, minHeight: 40)
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

/// A slim dark display set into the plastic.
struct Readout<Content: View>: View {
    @ViewBuilder var content: Content
    var body: some View {
        content
            .frame(maxWidth: .infinity, minHeight: 22, alignment: .leading)
            .padding(.horizontal, 12).padding(.vertical, 9)
            .background(Dex.glass, in: RoundedRectangle(cornerRadius: 9, style: .continuous))
            .overlay { DotMask(pitch: 2.5).opacity(0.5).clipShape(RoundedRectangle(cornerRadius: 9, style: .continuous)).allowsHitTesting(false) }
            .overlay(RoundedRectangle(cornerRadius: 9, style: .continuous).strokeBorder(.white.opacity(0.14), lineWidth: 1).offset(y: 1))
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
