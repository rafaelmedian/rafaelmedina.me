import SwiftUI
import PocketDexCore

// MARK: - Body (the stationary half): scanner and control deck

struct BodyPanel: View {
    let store: GameStore
    /// When true the scanner grows to fill the panel; otherwise it keeps a fixed height.
    var fill = true
    var body: some View {
        VStack(spacing: 10) {
            // The scanner takes everything the short control row leaves.
            Scanner(store: store)
                .frame(minHeight: 250, idealHeight: fill ? 520 : 300, maxHeight: fill ? .infinity : 330)
                .layoutPriority(1)
            ControlDeck(store: store)
                .frame(height: 76)
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
            CRTScreen(power: power, radius: Dex.screenRadius) {
                // Discoveries take over the scanner; the answers stay on the flap.
                Group {
                    if store.collectionVisible {
                        CollectionGrid(store: store).transition(.opacity)
                    } else {
                        ScannerPicture(store: store).transition(.opacity)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
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
            HStack {
                Text(revealed ? "SIGNAL IDENTIFIED" : "SCANNING…")
                Spacer()
                Text(revealed ? "No.\(store.pokemon.number)" : "No.???")
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

/// The right thumb's corner: the camera key, then OK as the big primary
/// button, lit green whenever it can be pressed.
private struct ControlDeck: View {
    let store: GameStore
    var body: some View {
        HStack(alignment: .center, spacing: 14) {
            CameraButton(store: store)
                .padding(4)
                .background(Circle().fill(Dex.groove.shadow(.inner(color: .black.opacity(0.6), radius: 2, y: 1.5))))
                .overlay(Circle().strokeBorder(LinearGradient(colors: [.clear, .white.opacity(0.25)], startPoint: .top, endPoint: .bottom), lineWidth: 1))
            DotGrille(rows: 3, columns: 9, dot: 4, gap: 4)
            Spacer(minLength: 0)
            Button { store.confirm() } label: {
                VStack(spacing: 1) {
                    Image(systemName: store.game.round.revealed ? "arrow.right" : "checkmark").font(.system(size: 20, weight: .black))
                    Text(store.game.round.revealed ? "NEXT" : "OK").font(.system(size: 10, weight: .black, design: .rounded)).tracking(1)
                }
            }
            .buttonStyle(ArcadeButtonStyle(tint: store.canConfirm ? .green : .spent, armed: store.canConfirm, size: 80, wake: 0.85))
            .background(Circle().fill(Dex.groove.shadow(.inner(color: .black.opacity(0.6), radius: 3, y: 2))).padding(-3))
            .overlay(Circle().strokeBorder(LinearGradient(colors: [.clear, .white.opacity(0.25)], startPoint: .top, endPoint: .bottom), lineWidth: 1).padding(-3))
            .disabled(!store.canConfirm)
            .accessibilityLabel(store.game.round.revealed ? "Next Pokémon" : "Confirm answer")
            .accessibilityIdentifier("confirm-answer")
        }
    }
}

/// Mist's camera button: a small dark round key. It fires the lens flash,
/// snaps the scanner screen, and slides a print out of the corner; tap the
/// print to share it.
private struct CameraButton: View {
    let store: GameStore
    @State private var photo: Image?
    @State private var shots = 0
    @Environment(\.displayScale) private var displayScale
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Button(action: snap) {
            Image(systemName: "camera.fill").font(.system(size: 15, weight: .semibold))
        }
        .buttonStyle(DarkRoundStyle())
        .accessibilityLabel("Take a snapshot")
        .accessibilityIdentifier("camera")
        .overlay(alignment: .bottomTrailing) {
            if let photo {
                ShareLink(item: photo, preview: SharePreview("PocketDex", image: photo)) {
                    // A fixed-size print; left to itself ShareLink shrinks the image to icon size.
                    Color.clear
                        .frame(width: 112, height: 97)
                        .overlay { photo.resizable().aspectRatio(contentMode: .fill) }
                        .clipped()
                        .padding(5).padding(.bottom, 14)
                        .background(Color(white: 0.97), in: RoundedRectangle(cornerRadius: 4))
                        .shadow(color: .black.opacity(0.35), radius: 8, y: 5)
                        .rotationEffect(.degrees(-6))
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Share snapshot")
                .offset(x: -8, y: -64)
                .transition(reduceMotion ? .opacity : .move(edge: .bottom).combined(with: .opacity).combined(with: .scale(scale: 0.6, anchor: .bottomTrailing)))
            }
        }
        .task(id: shots) {
            // The print waits a few seconds to be tapped, then tucks away.
            guard photo != nil else { return }
            try? await Task.sleep(for: .seconds(4))
            guard !Task.isCancelled else { return }
            withAnimation(reduceMotion ? nil : Dex.reveal) { photo = nil }
        }
    }

    private func snap() {
        store.snap()
        let renderer = ImageRenderer(content: SnapshotCard(store: store).environment(\.dexPower, 1))
        renderer.proposedSize = ProposedViewSize(width: 352, height: 306)
        renderer.scale = displayScale
        guard let image = renderer.uiImage else { return }
        withAnimation(reduceMotion ? nil : Dex.reveal.delay(0.15)) { photo = Image(uiImage: image) }
        shots += 1
    }
}

/// What the camera captures: the scanner screen in a strip of case plastic.
private struct SnapshotCard: View {
    let store: GameStore
    var body: some View {
        VStack(spacing: 10) {
            CRTScreen(power: 1, radius: 14) { ScannerPicture(store: store) }
                .frame(width: 320, height: 250)
            Text("POCKETDEX · \(store.game.captured.count)/12")
                .font(.system(size: 11, weight: .heavy, design: .monospaced)).tracking(2)
                .foregroundStyle(Dex.cream.opacity(0.85))
        }
        .padding(16)
        .background(ShellBackground())
        .fixedSize()
    }
}

/// A small dark round key, as on Mist's camera button.
struct DarkRoundStyle: ButtonStyle {
    var size: CGFloat = 48
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        let pressed = configuration.isPressed
        return ZStack {
            Circle().fill(Color(red: 0.03, green: 0.03, blue: 0.04)).frame(width: size, height: size).offset(y: 3)
            Circle().fill(RadialGradient(colors: [Color(white: 0.24), Color(white: 0.12)], center: UnitPoint(x: 0.45, y: 0.3), startRadius: 0, endRadius: size * 0.6))
                .overlay(Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.25), .clear], startPoint: .top, endPoint: .center), lineWidth: 1))
                .frame(width: size, height: size)
                .offset(y: pressed ? 2.5 : 0)
            configuration.label.foregroundStyle(Color(white: 0.62)).offset(y: pressed ? 2.5 : 0)
        }
        .frame(width: size, height: size + 4)
        .shadow(color: Dex.groove.opacity(0.45), radius: 4, y: 3)
        .contentShape(Circle())
        .animation(reduceMotion ? nil : Dex.squeeze, value: pressed)
    }
}

// MARK: - Flap (the half that swings): clue, answers, confirm

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
    /// Fill the flap: the touchscreen takes the height the clue leaves.
    var fill = false
    @Environment(\.dexPower) private var power
    @Environment(\.dynamicTypeSize) private var typeSize
    var body: some View {
        VStack(spacing: 16) {
            // Professor Oak gives the clue, then congratulates you once it is solved.
            CRTScreen(power: power, radius: Dex.screenRadius) {
                HStack(alignment: .top, spacing: 14) {
                    OakPortrait()
                        .frame(width: 58, height: 64)
                        .padding(4)
                        .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
                        .overlay(RoundedRectangle(cornerRadius: 8, style: .continuous).strokeBorder(Dex.phosphor.opacity(0.25), lineWidth: 1))
                    VStack(alignment: .leading, spacing: 6) {
                        Text(store.game.round.revealed ? "PROF. OAK · REGISTERED" : "PROF. OAK · CLUE")
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
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
            // A fixed height, sized for the longest line, so nothing below moves
            // when the clue changes or turns into Oak's congratulations.
            .frame(height: 118)
            .recessed(radius: Dex.screenRadius)

            // The rest of the flap is one touchscreen.
            TouchDeck(store: store)
                .frame(minHeight: 300, maxHeight: fill ? .infinity : 380)
                .recessed(radius: Dex.screenRadius)
        }
    }

    private var oakLine: String {
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
