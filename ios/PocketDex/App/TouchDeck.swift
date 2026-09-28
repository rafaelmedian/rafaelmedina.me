import SwiftUI
import PocketDexCore

/// The flap as one low-res CRT touchscreen, after Mist's control panel:
/// Professor Oak's clue on top, four coloured answer pills, and the hint
/// log under them.
/// Everything is drawn on the glass, so it wakes, dims, and scan-lines with
/// the rest.
struct TouchDeck: View {
    let store: GameStore
    @Environment(\.deckPower) private var power
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        CRTScreen(power: power, radius: Dex.screenRadius, pitch: 3) {
            VStack(spacing: 0) {
                if !store.asleep {
                    OakClue(store: store).padding([.horizontal, .top], 12).transition(.opacity)
                }
                Group {
                    if store.asleep {
                        SleepCard(store: store).transition(.opacity)
                    } else if store.mode == .scan {
                        ScanControls(store: store).transition(.opacity)
                    } else {
                        controls.transition(.opacity)
                    }
                }
                .frame(maxHeight: .infinity)
            }
            .animation(reduceMotion ? nil : Dex.quick, value: store.asleep)
            .animation(reduceMotion ? nil : Dex.quick, value: store.mode)
        }
    }

    private var controls: some View {
        // Once found, the answers give way to the result and a way on.
        Group {
            if store.game.round.revealed {
                FoundCard(store: store).transition(.opacity.combined(with: .scale(scale: 0.97)))
            } else {
                VStack(spacing: 12) {
                    HStack(spacing: 12) { pill(0); pill(1) }
                    HStack(spacing: 12) { pill(2); pill(3) }
                    HintLog(store: store)
                }
                .transition(.opacity)
            }
        }
        .frame(maxHeight: .infinity)
        .animation(reduceMotion ? nil : Dex.reveal, value: store.game.round.revealed)
        .padding(12)
    }

    // MARK: Answer pills

    private static let colors: [Color] = [
        Color(red: 0.95, green: 0.72, blue: 0.25),
        Color(red: 0.93, green: 0.27, blue: 0.2),
        Color(red: 0.2, green: 0.36, blue: 0.95),
        Color(red: 0.24, green: 0.66, blue: 0.3)
    ]

    @ViewBuilder private func pill(_ index: Int) -> some View {
        let choices = store.game.round.choices
        if index < choices.count, let pokemon = Catalog.pokemon(id: choices[index]) {
            let rejected = store.game.round.rejected.contains(index)
            let selected = store.game.round.selection == index && !rejected
            Button { store.choose(index) } label: {
                HStack(spacing: 5) {
                    Text(["A", "B", "C", "D"][index]).font(.system(size: 10, weight: .black, design: .monospaced)).opacity(0.55)
                    Text(pokemon.name).font(.system(.title3, design: .rounded, weight: .heavy))
                        .lineLimit(1).minimumScaleFactor(0.6)
                        .strikethrough(rejected)
                }
                .foregroundStyle(.black.opacity(rejected ? 0.45 : 0.75))
                .padding(.horizontal, 8)
                .frame(maxWidth: .infinity)
                .frame(minHeight: 52, maxHeight: 96)
                .background(rejected ? Color(white: 0.3) : Self.colors[index], in: Capsule())
                // Each pill sits in its own darker nest on the glass.
                .padding(3)
                .background(Capsule().fill(.black.opacity(0.55).shadow(.inner(color: .black, radius: 2, y: 1.5))))
                .overlay(Capsule().strokeBorder(LinearGradient(colors: [.clear, Dex.phosphor.opacity(0.18)], startPoint: .top, endPoint: .bottom), lineWidth: 1))
                .overlay(Capsule().strokeBorder(.white.opacity(selected ? 0.95 : 0), lineWidth: 2.5).padding(-1))
                .shadow(color: selected ? Self.colors[index].opacity(0.9) : .clear, radius: 10)
                .contentShape(Capsule())
            }
            .buttonStyle(GlassPress())
            .disabled(rejected || store.game.round.revealed)
            .accessibilityLabel(pokemon.name)
            .accessibilityValue(rejected ? "Incorrect" : selected ? "Selected" : "")
            .accessibilityAddTraits(selected ? .isSelected : [])
            .accessibilityIdentifier("answer-\(index)")
        }
    }
}

/// After Mist's sleep screen: two dark panels, a note, and one way back.
private struct SleepCard: View {
    let store: GameStore
    var body: some View {
        VStack(spacing: 10) {
            VStack(spacing: 8) {
                Image(systemName: "moon.zzz.fill").font(.system(size: 26, weight: .semibold))
                    .foregroundStyle(Dex.phosphor.opacity(0.7))
                Text("PocketDex is sleeping.")
                    .font(.system(.title3, design: .monospaced, weight: .semibold))
                Text("The Pokémon are resting too. Don't tap the lens.")
                    .font(.system(.footnote, design: .monospaced))
                    .foregroundStyle(Dex.phosphor.opacity(0.6))
            }
            .multilineTextAlignment(.center)
            .foregroundStyle(Dex.phosphor)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
            HStack(spacing: 10) {
                wakeButton("Guess", spoken: "Discovery game", icon: "questionmark.circle.fill", id: "wake-up") { store.wake(into: .game) }
                wakeButton("Scan", spoken: "Scan mode", icon: "camera.viewfinder", id: "wake-scan") { store.wake(into: .scan) }
            }
            .frame(height: 76)
        }
        .padding(12)
    }
}

extension SleepCard {
    /// A short verb on the key so it sits well inside its half of the strip;
    /// VoiceOver reads the mode's full name.
    func wakeButton(_ title: String, spoken: String, icon: String, id: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: icon).font(.system(size: 18, weight: .bold))
                Text(title).font(.system(.headline, design: .monospaced, weight: .bold))
                    .lineLimit(1).minimumScaleFactor(0.8)
            }
            .padding(.horizontal, 12)
            .foregroundStyle(Dex.phosphor)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Dex.phosphor.opacity(0.12), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
            .contentShape(Rectangle())
        }
        .buttonStyle(GlassPress())
        .accessibilityLabel(spoken)
        .accessibilityIdentifier(id)
    }
}

/// Scan mode's touchscreen: one big SCAN button and a way back to the game.
private struct ScanControls: View {
    let store: GameStore
    var body: some View {
        VStack(spacing: 12) {
            Button { store.scan() } label: {
                VStack(spacing: 8) {
                    Image(systemName: store.scanning ? "dot.radiowaves.left.and.right" : "viewfinder")
                        .font(.system(size: 40, weight: .bold))
                        .symbolEffect(.variableColor.iterative, isActive: store.scanning)
                    Text(store.scanning ? "SCANNING…" : store.scanResult == nil ? "SCAN" : "SCAN AGAIN")
                        .font(.system(.title2, design: .monospaced, weight: .heavy)).tracking(2)
                }
                .foregroundStyle(.black.opacity(0.75))
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Color(red: 0.24, green: 0.72, blue: 0.34).opacity(store.scanning ? 0.55 : 1), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                .padding(4)
                .background(RoundedRectangle(cornerRadius: 22, style: .continuous).fill(.black.opacity(0.55).shadow(.inner(color: .black, radius: 2, y: 1.5))))
                .contentShape(Rectangle())
            }
            .buttonStyle(GlassPress())
            .disabled(store.scanning)
            .accessibilityIdentifier("scan-button")
            HStack(spacing: 10) {
                Text(store.scanResult.flatMap { Catalog.pokemon(id: $0) }.map { "Last scan: \($0.name)" } ?? "Scans don't count toward your Pokédex.")
                    .font(.system(.footnote, design: .monospaced, weight: .semibold))
                    .foregroundStyle(Dex.phosphor.opacity(0.75))
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                    .padding(.horizontal, 12)
                    .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                // Scan mode's way back to the game, without sleeping first.
                Button { store.switchMode(to: .game) } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "arrow.uturn.backward").font(.system(size: 15, weight: .bold))
                        Text("Guess").font(.system(.headline, design: .monospaced, weight: .bold))
                    }
                    .foregroundStyle(Dex.phosphor)
                    .padding(.horizontal, 14)
                    .frame(maxHeight: .infinity)
                    .background(Dex.phosphor.opacity(0.12), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .contentShape(Rectangle())
                }
                .buttonStyle(GlassPress())
                .disabled(store.scanning)
                .accessibilityLabel("Back to the discovery game")
                .accessibilityIdentifier("back-to-guess")
            }
            .frame(height: 64)
        }
        .padding(12)
    }
}

/// The found message: the Pokémon on top, its name and entry, and a big
/// centred button low on the screen to go on to the next.
private struct FoundCard: View {
    let store: GameStore
    var body: some View {
        let caught = store.captureStage == .caught
        VStack(spacing: 10) {
            Image(store.pokemon.asset).resizable().scaledToFit()
                .frame(maxWidth: 150, maxHeight: 150)
                .shadow(color: .white.opacity(0.3), radius: 8)
                .accessibilityHidden(true)
            VStack(spacing: 2) {
                Text("YOU FOUND IT!")
                    .font(.system(size: 12, weight: .heavy, design: .monospaced)).tracking(2)
                    .foregroundStyle(Color(red: 0.45, green: 1, blue: 0.5))
                Text(store.pokemon.name)
                    .font(.system(.title, design: .rounded, weight: .heavy))
                    .foregroundStyle(Dex.phosphor)
            }
            EntryStrip(store: store)
            Spacer(minLength: 8)
            Button { store.confirm() } label: {
                HStack(spacing: 10) {
                    Text(caught ? "Next Pokémon" : "Registering…")
                    Image(systemName: "arrow.right")
                }
                .font(.system(.title3, design: .rounded, weight: .heavy))
                .foregroundStyle(.black.opacity(0.75))
                .frame(maxWidth: 320)
                .frame(height: 60)
                .background(Color(red: 0.24, green: 0.72, blue: 0.34).opacity(caught ? 1 : 0.4), in: Capsule())
                .padding(3)
                .background(Capsule().fill(.black.opacity(0.55).shadow(.inner(color: .black, radius: 2, y: 1.5))))
                .contentShape(Capsule())
            }
            .buttonStyle(GlassPress())
            .disabled(!caught)
            .accessibilityIdentifier("next-pokemon")
        }
        .padding(16)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

/// On-glass buttons give a little when pressed, like a soft touchscreen.
private struct GlassPress: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1)
            .brightness(configuration.isPressed ? 0.12 : 0)
            .animation(reduceMotion ? nil : Dex.squeeze, value: configuration.isPressed)
    }
}
