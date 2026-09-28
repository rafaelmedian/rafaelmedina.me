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
    @Environment(\.deckPower) private var deckPower
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
            }
            // Asleep, the dark glass keeps a dim moon, matching the flap's sleep screen.
            .overlay {
                if store.asleep {
                    SleepGlyph().opacity(deckPower).transition(.opacity)
                }
            }
            .animation(Dex.quick, value: store.asleep)
            .recessed(radius: Dex.screenRadius, depth: 4)
            .animation(Dex.quick, value: store.collectionVisible)
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

/// A dim moon that breathes on the scanner's dark glass while PocketDex sleeps.
private struct SleepGlyph: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: "moon.zzz.fill")
                .font(.system(size: 44, weight: .semibold))
                .symbolEffect(.breathe, isActive: !reduceMotion)
            Text("Zzz…")
                .font(.system(.footnote, design: .monospaced, weight: .semibold)).tracking(2)
        }
        .foregroundStyle(Dex.phosphor.opacity(0.35))
        .shadow(color: Dex.phosphor.opacity(0.3), radius: 6)
        .allowsHitTesting(false)
        .accessibilityHidden(true)
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

/// The entry's data in one row, shown on the flap once the Pokémon is
/// found: type, height, weight, and name.
struct EntryStrip: View {
    let store: GameStore
    var body: some View {
        let pokemon = store.pokemon
        HStack(spacing: 0) {
            cell("TYPE", pokemon.type.capitalized)
            cell("HEIGHT", String(format: "%.1f m", pokemon.height))
            cell("WEIGHT", String(format: "%.1f kg", pokemon.weight))
        }
        .padding(.vertical, 8)
        .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("entry")
    }

    private func cell(_ label: String, _ value: String, tint: Color = Dex.phosphor) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(label).font(.system(size: 8, weight: .bold, design: .monospaced)).tracking(1.2)
                .foregroundStyle(Dex.phosphor.opacity(0.5))
            Text(value).font(.system(.footnote, design: .monospaced, weight: .bold))
                .foregroundStyle(tint)
                .lineLimit(1).minimumScaleFactor(0.55)
        }
        .padding(.horizontal, 8)
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// The flap's hint log, under the answers. Each touch on the silhouette
/// adds one line, which slides in and glows; the newest reads in yellow.
/// Its height is fixed for all five, so the answers above never move.
struct HintLog: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        let taken = store.hintsTaken
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 8) {
                Text("HINTS").tracking(1.5)
                Spacer(minLength: 0)
                HStack(spacing: 5) {
                    ForEach(0..<GameStore.hintCount, id: \.self) { index in
                        Circle().fill(index < taken ? Dex.yellow : Dex.phosphor.opacity(0.18))
                            .frame(width: 7, height: 7)
                            .shadow(color: index < taken ? Dex.yellow.opacity(0.7) : .clear, radius: 3)
                    }
                }
                .accessibilityHidden(true)
            }
            .font(.system(size: 9, weight: .bold, design: .monospaced))
            .foregroundStyle(Dex.phosphor.opacity(0.55))
            if taken == 0 {
                Text("Touch the Pokémon on the scanner. Every touch reads one more clue.")
                    .font(.system(.footnote, design: .monospaced, weight: .semibold))
                    .foregroundStyle(Dex.phosphor.opacity(0.6))
                    .transition(.opacity)
            }
            ForEach(0..<taken, id: \.self) { index in
                let line = self.line(index)
                let newest = index == taken - 1
                HStack(alignment: .firstTextBaseline, spacing: 10) {
                    Text(line.label)
                        .font(.system(size: 9, weight: .bold, design: .monospaced)).tracking(1.2)
                        .foregroundStyle(Dex.phosphor.opacity(0.5))
                        .frame(width: 58, alignment: .leading)
                    Text(line.value)
                        .font(.system(.callout, design: .monospaced, weight: .bold))
                        .foregroundStyle(newest ? Dex.yellow : Dex.phosphor)
                        .shadow(color: (newest ? Dex.yellow : Dex.phosphor).opacity(0.6), radius: newest ? 5 : 2)
                        .lineLimit(1).minimumScaleFactor(0.6)
                }
                .transition(reduceMotion ? .opacity : .asymmetric(insertion: .move(edge: .bottom).combined(with: .opacity), removal: .opacity))
            }
            Spacer(minLength: 0)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .topLeading)
        .frame(height: 162)
        .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous).strokeBorder(Dex.yellow.opacity(taken > 0 ? 0.25 : 0), lineWidth: 1))
        .clipped()
        .animation(reduceMotion ? nil : .spring(response: 0.4, dampingFraction: 0.75), value: taken)
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("scan-data")
    }

    private func line(_ index: Int) -> (label: String, value: String) {
        let pokemon = store.pokemon
        switch index {
        case 0: return ("TYPE", pokemon.type.capitalized)
        case 1: return ("HEIGHT", String(format: "%.1f m", pokemon.height))
        case 2: return ("WEIGHT", String(format: "%.1f kg", pokemon.weight))
        case 3: return ("NAME", "\(pokemon.name.prefix(1))" + String(repeating: "·", count: pokemon.name.count - 1))
        default: return ("NOT", store.ruledOut.flatMap { Catalog.pokemon(id: $0)?.name } ?? "—")
        }
    }
}

private struct ScannerPicture: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        // The Pokémon stays hidden until the Poké Ball has caught it and let it out.
        let revealed = store.captureStage == .caught
        VStack(spacing: 6) {
            HStack(spacing: 10) {
                Text(revealed ? "SIGNAL IDENTIFIED" : store.game.round.revealed ? "CAPTURING…" : "SCANNING…")
                Text(revealed ? "No.\(store.pokemon.number)" : "No.???").opacity(0.6)
                Spacer(minLength: 0)
                DiscoveriesChip(store: store)
                SettingsKey(store: store)
                SleepKey(store: store)
            }
            .font(.system(size: 11, weight: .bold, design: .monospaced)).tracking(1)
            .foregroundStyle(Dex.phosphor.opacity(0.75))
            ZStack {
                ForEach([0.95, 0.66], id: \.self) { scale in
                    Circle().stroke(Dex.phosphor.opacity(0.14), style: StrokeStyle(lineWidth: 1, dash: [2, 5]))
                        .scaleEffect(scale)
                }
                // A right answer throws a Poké Ball in place of the silhouette.
                CaptureSequence(store: store)
                if store.captureStage == .hidden || store.captureStage == .caught {
                    // Touch the screen and the Pokémon answers, as Mist's face does.
                    Pettable(store: store) {
                        // Drawn as the screen's own pixels, which squish under a pinch.
                        PixelPokemon(store: store, revealed: revealed)
                            .padding(8)
                            .phaseAnimator(reduceMotion || revealed ? [1.0] : [1.0, 0.82]) { view, phase in view.opacity(phase) }
                                animation: { _ in .easeInOut(duration: 1.3) }
                    }
                    // It pops out of the opening ball, from small to full size.
                    .transition(reduceMotion ? .opacity : .asymmetric(
                        insertion: .scale(scale: 0.05).combined(with: .opacity)
                            .animation(.spring(duration: 0.55, bounce: 0.45).delay(0.1)),
                        removal: .identity))
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
            .accessibilityLabel(revealed ? store.pokemon.name : "Silhouette of an undiscovered Pokémon. Touch it for a hint.")
            .accessibilityAction(named: revealed ? "Poke" : "Hint") { store.poke() }
            .accessibilityIdentifier("scanner-art")
            Text(revealed ? store.pokemon.name : "Who's that Pokémon?")
                .font(.system(.title3, design: .monospaced, weight: .bold))
                .foregroundStyle(Dex.phosphor)
                .shadow(color: Dex.phosphor.opacity(0.7), radius: 5)
                .lineLimit(1).minimumScaleFactor(0.6)
                .accessibilityIdentifier("pokemon-name")
            // One line under the name: the round's feedback when there is
            // some, otherwise what touching the Pokémon will do.
            Text(caption.text)
                .font(.system(size: 11, weight: .semibold, design: .monospaced)).tracking(1)
                .foregroundStyle(caption.feedback ? Dex.yellow : Dex.phosphor.opacity(0.55))
                .lineLimit(1).minimumScaleFactor(0.7)
                .animation(Dex.quick, value: caption.text)
        }
        .padding(16)
    }

    private var caption: (text: String, feedback: Bool) {
        switch store.captureStage {
        case .reveal: return ("Poké Ball, go!", true)
        case .ball: return ("Wiggle… wiggle…", true)
        case .hidden, .caught: break
        }
        if store.game.round.revealed { return ("#\(store.pokemon.number) · \(store.pokemon.species) Pokémon", false) }
        if store.message != GameStore.idleMessage { return (store.message, true) }
        return (store.hintsTaken < GameStore.hintCount ? "Touch it for a hint." : "No more hints. Trust your gut!", false)
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

/// A small round key drawn on the scanner's glass, sized to sit in the
/// header beside the Discoveries chip.
struct GlassKeyLabel: View {
    let icon: String
    var body: some View {
        Image(systemName: icon)
            .font(.system(size: 10, weight: .bold))
            .foregroundStyle(Dex.phosphor.opacity(0.8))
            .frame(width: 22, height: 22)
            .background(Dex.phosphor.opacity(0.06), in: Circle())
            .overlay(Circle().strokeBorder(Dex.phosphor.opacity(0.45), lineWidth: 1))
            // A comfortable target around a small key.
            .padding(11).contentShape(Rectangle()).padding(-11)
    }
}

/// Sleep, always in reach in the scanner's header, in both modes.
struct SleepKey: View {
    let store: GameStore
    var body: some View {
        Button { store.sleep() } label: { GlassKeyLabel(icon: "moon.zzz.fill") }
            .buttonStyle(.plain)
            .accessibilityLabel("Put PocketDex to sleep")
            .accessibilityIdentifier("sleep")
    }
}

/// Sound, haptics, and starting over, folded into one small key in the
/// scanner's header so they stay out of the way of the game.
struct SettingsKey: View {
    let store: GameStore
    @State private var confirmingReset = false
    var body: some View {
        Menu {
            Button { store.toggleMute() } label: {
                Label(store.muted ? "Enable sound" : "Mute sound", systemImage: store.muted ? "speaker.wave.2" : "speaker.slash")
            }
            Button { store.toggleHaptics() } label: {
                Label(store.hapticsOn ? "Turn off haptics" : "Turn on haptics", systemImage: "waveform.path")
            }
            Divider()
            Button(role: .destructive) { confirmingReset = true } label: {
                Label("Reset progress", systemImage: "arrow.counterclockwise")
            }
        } label: {
            GlassKeyLabel(icon: "gearshape.fill")
        }
        .accessibilityLabel("Options")
        .accessibilityIdentifier("options")
        // Starting over wipes the Pokédex, so it asks first.
        .confirmationDialog("Reset your Pokédex?", isPresented: $confirmingReset, titleVisibility: .visible) {
            Button("Reset progress", role: .destructive) { store.replay() }
        } message: {
            Text("Every discovery is cleared and a new round begins.")
        }
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
        guard store.captureStage == .caught else { return "That's it! Quick, a Poké Ball!" }
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
