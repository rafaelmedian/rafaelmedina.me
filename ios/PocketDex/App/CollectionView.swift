import SwiftUI
import PocketDexCore

/// Discoveries replace the answer keys on the flap; the scanner stays put.
struct CollectionPanel: View {
    let store: GameStore
    @Environment(\.dexPower) private var power
    var body: some View {
        VStack(spacing: 16) {
            HStack(spacing: 12) {
                Button { store.collectionVisible = false } label: {
                    Image(systemName: "arrow.uturn.backward").font(.system(size: 15, weight: .bold))
                }
                .buttonStyle(KeyCapStyle(tint: .cream, depth: 6, corners: .all(12), wake: 0))
                .accessibilityLabel("Back to game").accessibilityIdentifier("back-to-game")
                VStack(alignment: .leading, spacing: 2) {
                    Engraved(text: "FIELD NOTES", size: 10)
                    Text("Discoveries").font(.system(.title2, design: .rounded, weight: .heavy)).foregroundStyle(Dex.cream)
                        .lineLimit(1).minimumScaleFactor(0.5)
                }
                Spacer(minLength: 0)
                LCD {
                    Text("\(store.game.captured.count)/12").font(.system(.headline, design: .monospaced, weight: .bold))
                }
            }
            CRTScreen(power: power, radius: 16, pitch: 3) {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 78, maximum: 140), spacing: 8)], spacing: 8) {
                    ForEach(Catalog.all) { pokemon in
                        let caught = store.game.captured.contains(pokemon.id)
                        VStack(spacing: 4) {
                            Group {
                                if caught {
                                    Image(pokemon.asset).resizable().scaledToFit()
                                } else {
                                    Image(pokemon.asset).resizable().renderingMode(.template).scaledToFit()
                                        .foregroundStyle(Dex.phosphor.opacity(0.16))
                                }
                            }
                            .frame(height: 54)
                            .accessibilityHidden(true)
                            Text(caught ? pokemon.name.uppercased() : "No.\(pokemon.number)")
                                .font(.system(size: 9, weight: .bold, design: .monospaced))
                                .foregroundStyle(Dex.phosphor.opacity(caught ? 0.9 : 0.45))
                                .lineLimit(1).minimumScaleFactor(0.7)
                        }
                        .padding(6)
                        .frame(maxWidth: .infinity)
                        .background(Dex.phosphor.opacity(caught ? 0.08 : 0.03), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
                        .accessibilityElement(children: .ignore)
                        .accessibilityLabel(caught ? "\(pokemon.name), discovered" : "Undiscovered Pokémon")
                    }
                }
                .padding(12)
            }
            .fixedSize(horizontal: false, vertical: true)
        }
    }
}

struct CompletedPanel: View {
    let store: GameStore
    @Environment(\.dexPower) private var power
    @State private var confirmReplay = false
    var body: some View {
        VStack(spacing: 16) {
            CRTScreen(power: power, radius: 16) {
                VStack(spacing: 14) {
                    Pokeball().frame(width: 72, height: 72)
                    Text("TWELVE NEW FRIENDS.").font(.system(.title3, design: .monospaced, weight: .bold))
                    Text("You found every Pokémon in this little corner of Kanto.")
                        .font(.system(.callout, design: .monospaced))
                        .foregroundStyle(Dex.phosphor.opacity(0.75))
                }
                .foregroundStyle(Dex.phosphor)
                .multilineTextAlignment(.center)
                .padding(22)
                .frame(maxWidth: .infinity)
            }
            .fixedSize(horizontal: false, vertical: true)
            Button { store.collectionVisible = true } label: {
                Label("Visit your collection", systemImage: "square.grid.2x2.fill")
                    .font(.system(.subheadline, design: .rounded, weight: .bold)).frame(maxWidth: .infinity)
            }.buttonStyle(KeyCapStyle(tint: .cream, depth: 6, corners: .all(12), wake: 0))
            Button { confirmReplay = true } label: {
                Text("Start a new adventure").font(.system(.subheadline, design: .rounded, weight: .bold)).frame(maxWidth: .infinity)
            }
            .buttonStyle(KeyCapStyle(tint: .yellow, depth: 6, corners: .all(12), wake: 0))
            .confirmationDialog("Start a new collection?", isPresented: $confirmReplay, titleVisibility: .visible) {
                Button("Start again", role: .destructive) { store.replay() }
            } message: { Text("Your 12 discoveries will be cleared.") }
        }
    }
}
