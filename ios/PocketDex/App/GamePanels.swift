import SwiftUI
import PocketDexCore

// MARK: - Body (the stationary half): the scanner

struct BodyPanel: View {
    let store: GameStore
    /// When true the scanner grows to fill the panel; otherwise it keeps a fixed height.
    var fill = true
    var body: some View {
        // The scanner is the whole half; its controls are drawn on the glass.
        Scanner(store: store)
            .frame(minHeight: 250, idealHeight: fill ? 600 : 380, maxHeight: fill ? .infinity : 410)
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
            CRTScreen(power: power, radius: Dex.screenRadius) {
                // Discoveries take over the scanner; the answers stay on the flap.
                VStack(spacing: 0) {
                    Group {
                        if store.collectionVisible {
                            CollectionGrid(store: store).transition(.opacity)
                        } else {
                            if store.mode == .scan {
                                ScanScreen(store: store).transition(.opacity)
                            } else {
                                ScannerPicture(store: store).transition(.opacity)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    // The trackpad sits under the Pokémon it steers. The camera
                    // view in scan mode keeps the whole glass; its flap has sleep.
                    if store.mode == .game {
                        ControlStrip(store: store)
                            .padding(.horizontal, 12).padding(.bottom, 12)
                            .transition(.opacity)
                    }
                }
            }
            .recessed(radius: Dex.screenRadius, depth: 4)
            .animation(Dex.quick, value: store.collectionVisible)
            .animation(Dex.quick, value: store.mode)
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

/// The entry's data: type, height, weight, and status. Unknown until the
/// Pokémon is identified, so the numbers never give the answer away.
private struct ScanData: View {
    let store: GameStore
    var body: some View {
        let revealed = store.game.round.revealed
        let pokemon = store.pokemon
        VStack(alignment: .leading, spacing: 10) {
            row("TYPE", revealed ? pokemon.type.capitalized : "???")
            row("HEIGHT", revealed ? String(format: "%.1f m", pokemon.height) : "???")
            row("WEIGHT", revealed ? String(format: "%.1f kg", pokemon.weight) : "???")
            Rectangle().fill(Dex.phosphor.opacity(0.2)).frame(height: 1)
            row("STATUS", revealed ? "IDENTIFIED" : "SCANNING", tint: revealed ? Color(red: 0.45, green: 1, blue: 0.5) : Dex.yellow)
        }
        .padding(12)
        .frame(maxHeight: .infinity, alignment: .center)
        .background(Dex.phosphor.opacity(0.05), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 10, style: .continuous).strokeBorder(Dex.phosphor.opacity(0.18), lineWidth: 1))
        .animation(Dex.quick, value: revealed)
        .accessibilityElement(children: .combine)
    }

    private func row(_ label: String, _ value: String, tint: Color = Dex.phosphor) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label).font(.system(size: 9, weight: .bold, design: .monospaced)).tracking(1.5)
                .foregroundStyle(Dex.phosphor.opacity(0.5))
            Text(value).font(.system(.callout, design: .monospaced, weight: .bold))
                .foregroundStyle(tint)
                .lineLimit(1).minimumScaleFactor(0.6)
        }
    }
}

private struct ScannerPicture: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        let revealed = store.game.round.revealed
        VStack(spacing: 6) {
            HStack(spacing: 10) {
                Text(revealed ? "SIGNAL IDENTIFIED" : "SCANNING…")
                Text(revealed ? "No.\(store.pokemon.number)" : "No.???").opacity(0.6)
                Spacer(minLength: 0)
                DiscoveriesChip(store: store)
            }
            .font(.system(size: 11, weight: .bold, design: .monospaced)).tracking(1)
            .foregroundStyle(Dex.phosphor.opacity(0.75))
            HStack(alignment: .center, spacing: 12) {
            ZStack {
                ForEach([0.95, 0.66], id: \.self) { scale in
                    Circle().stroke(Dex.phosphor.opacity(0.14), style: StrokeStyle(lineWidth: 1, dash: [2, 5]))
                        .scaleEffect(scale)
                }
                if store.captureStage == .ball {
                    Pokeball().frame(width: 84, height: 84).transition(.scale.combined(with: .opacity))
                } else {
                    // Touch the screen and the Pokémon answers, as Mist's face does.
                    Pettable(store: store) {
                        if revealed {
                            Image(store.pokemon.asset).resizable().scaledToFit()
                                .shadow(color: .white.opacity(0.35), radius: 10)
                                .padding(8)
                        } else {
                            Image(store.pokemon.asset).resizable().renderingMode(.template).scaledToFit()
                                .foregroundStyle(Dex.phosphor)
                                .shadow(color: Dex.phosphor.opacity(0.8), radius: 8)
                                .padding(8)
                                .phaseAnimator(reduceMotion ? [1.0] : [1.0, 0.82]) { view, phase in view.opacity(phase) }
                                    animation: { _ in .easeInOut(duration: 1.3) }
                        }
                    }
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
            .accessibilityAction(named: "Poke") { store.poke() }
            .accessibilityIdentifier("scanner-art")
            // Once identified, the entry's data sits beside the art.
            ScanData(store: store).frame(width: 150)
            }
            Text(revealed ? store.pokemon.name : "Who's that Pokémon?")
                .font(.system(.title3, design: .monospaced, weight: .bold))
                .foregroundStyle(Dex.phosphor)
                .shadow(color: Dex.phosphor.opacity(0.7), radius: 5)
                .lineLimit(1).minimumScaleFactor(0.6)
                .accessibilityIdentifier("pokemon-name")
            Text(revealed ? "#\(store.pokemon.number) · \(store.pokemon.species) Pokémon" : "Touch it. Pinch to look closer.")
                .font(.system(size: 10, weight: .semibold, design: .monospaced)).tracking(1)
                .foregroundStyle(Dex.phosphor.opacity(0.55))
        }
        .padding(16)
    }
}

/// Discoveries, drawn on the glass: a thin phosphor chip in the scanner's
/// header that swaps the screen to the collection and back, with the count.
struct DiscoveriesChip: View {
    let store: GameStore
    var body: some View {
        let showing = store.collectionVisible
        Button { store.collectionVisible.toggle() } label: {
            HStack(spacing: 5) {
                Image(systemName: showing ? "arrow.uturn.backward" : "square.grid.2x2")
                    .font(.system(size: 10, weight: .bold))
                Text(String(format: "%02d/12", store.game.captured.count))
                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                    .accessibilityLabel("\(store.game.captured.count) of 12 Pokémon discovered")
                    .accessibilityIdentifier("capture-count")
            }
            .tracking(1)
            .foregroundStyle(showing ? Dex.glass : Dex.phosphor)
            .padding(.horizontal, 8)
            .frame(height: 22)
            .background(showing ? Dex.phosphor : Dex.phosphor.opacity(0.06), in: Capsule())
            .overlay(Capsule().strokeBorder(Dex.phosphor.opacity(showing ? 0 : 0.45), lineWidth: 1))
            .shadow(color: showing ? Dex.phosphor.opacity(0.5) : .clear, radius: 4)
            // A comfortable target around a thin chip.
            .padding(.vertical, 11).padding(.horizontal, 4)
            .contentShape(Rectangle())
            .padding(.vertical, -11).padding(.horizontal, -4)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(showing ? "Back to game" : "Discoveries")
        .accessibilityIdentifier(showing ? "back-to-game" : "show-collection")
    }
}

// MARK: - Flap (the half that swings): one screen for the clue and answers

struct FlapPanel: View {
    let store: GameStore
    var fill = false
    var body: some View {
        if store.game.isComplete {
            CompletedPanel(store: store).frame(maxHeight: fill ? .infinity : nil, alignment: .top)
        } else {
            AnswerPanel(store: store, fill: fill)
        }
    }
}

struct AnswerPanel: View {
    let store: GameStore
    /// Fill the flap: the touchscreen takes its whole height.
    var fill = false
    var body: some View {
        // The flap is one touchscreen: Oak's clue on top, the answers below.
        TouchDeck(store: store)
            .frame(minHeight: 420, maxHeight: fill ? .infinity : 520)
            .recessed(radius: Dex.screenRadius)
    }
}

/// Professor Oak gives the clue, then congratulates you once it is solved.
/// Drawn on the flap's touchscreen, above the answers.
struct OakClue: View {
    let store: GameStore
    var body: some View {
        HStack(alignment: .top, spacing: 14) {
            OakPortrait()
                .frame(width: 58, height: 64)
                .padding(4)
                .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 8, style: .continuous).strokeBorder(Dex.phosphor.opacity(0.25), lineWidth: 1))
            VStack(alignment: .leading, spacing: 6) {
                Text(store.mode == .scan ? "PROF. OAK · SCANNER" : store.game.round.revealed ? "PROF. OAK · REGISTERED" : "PROF. OAK · CLUE")
                    .font(.system(size: 10, weight: .bold, design: .monospaced)).tracking(1.5)
                    .foregroundStyle(Dex.phosphor.opacity(0.55))
                Typewriter(text: oakLine)
                    .font(.system(.body, design: .monospaced, weight: .semibold))
                    .lineSpacing(3)
                    .foregroundStyle(Dex.phosphor)
                    .shadow(color: Dex.phosphor.opacity(0.5), radius: 3)
                    .lineLimit(3)
                    .minimumScaleFactor(0.8)
                    .accessibilityIdentifier("oak-line")
            }
            .frame(maxWidth: .infinity, alignment: .topLeading)
        }
        .padding(.horizontal, 14).padding(.vertical, 12)
        // A fixed height, sized for the longest line, so nothing below moves
        // when the clue changes or turns into Oak's congratulations.
        .frame(maxWidth: .infinity, minHeight: 104, maxHeight: 104, alignment: .topLeading)
        .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
    }

    private var oakLine: String {
        if store.mode == .scan {
            if let id = store.scanResult, let found = Catalog.pokemon(id: id) { return "Remarkable! That looks like a \(found.name)." }
            return "Point the lens at a Pokémon and press SCAN. I'll tell you what it is!"
        }
        guard store.game.round.revealed else { return store.pokemon.clue }
        let count = store.game.captured.count
        return "Splendid! That was \(store.pokemon.name). Your Pokédex now holds \(count) of 12."
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
