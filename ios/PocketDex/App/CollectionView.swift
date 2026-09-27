import SwiftUI
import PocketDexCore

struct CollectionView: View {
    let store: GameStore
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            HStack {
                VStack(alignment: .leading, spacing: 8) {
                    Stencil(text: "YOUR FIELD NOTES", size: 10)
                    Text("Little discoveries.")
                        .font(.system(.largeTitle, design: .rounded, weight: .heavy)).foregroundStyle(Dex.cream)
                }
                Spacer()
                Button { store.collectionVisible = false } label: { Image(systemName: "arrow.uturn.backward") }
                    .buttonStyle(HardwareButtonStyle(color: Dex.cream))
                    .accessibilityLabel("Back to game").accessibilityIdentifier("back-to-game")
            }
            LCD {
                HStack {
                    Stencil(text: "KANTO COLLECTION", size: 10, color: Dex.ink)
                    Spacer()
                    Text("\(store.game.captured.count) / 12").font(.system(.title3, design: .monospaced, weight: .bold))
                }.foregroundStyle(Dex.ink)
            }
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 95, maximum: 180))], spacing: 14) {
                ForEach(Catalog.all) { pokemon in
                    let caught = store.game.captured.contains(pokemon.id)
                    VStack(spacing: 6) {
                        HStack {
                            Stencil(text: pokemon.number, size: 9, color: Dex.screenDark)
                            Spacer()
                            if caught { Image(systemName: "checkmark.seal.fill").font(.caption).foregroundStyle(Dex.screenDark) }
                        }
                        Image(pokemon.asset).resizable().scaledToFit().frame(height: 76)
                            .accessibilityHidden(true)
                            .saturation(caught ? 1 : 0).brightness(caught ? 0 : -1).opacity(caught ? 1 : 0.16)
                        Text(caught ? pokemon.name : "???").font(.system(.caption, design: .rounded, weight: .bold))
                            .foregroundStyle(Dex.ink)
                    }.padding(10).background(caught ? Dex.cream : Dex.screen.opacity(0.85), in: RoundedRectangle(cornerRadius: 12))
                        .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(Dex.ink, lineWidth: 2))
                        .accessibilityElement(children: .ignore)
                        .accessibilityLabel(caught ? "\(pokemon.name), discovered" : "Undiscovered Pokémon")
                }
            }
            Text("Every silhouette is the start of a friendship.")
                .font(.system(.subheadline, design: .rounded)).foregroundStyle(Dex.cream)
        }
    }
}

struct CompletedView: View {
    let store: GameStore
    @State private var confirmReplay = false
    var body: some View {
        VStack(spacing: 26) {
            Stencil(text: "FIELD REPORT / COMPLETE")
            LCD {
                VStack(spacing: 20) {
                    Pokeball().frame(width: 86, height: 86)
                    Text("Twelve new friends.")
                        .font(.system(.largeTitle, design: .rounded, weight: .heavy))
                    Text("You found every Pokémon in this little corner of Kanto.")
                        .font(.system(.body, design: .rounded))
                    Stencil(text: "COLLECTION 12 / 12", size: 12, color: Dex.screenDark)
                }.multilineTextAlignment(.center).foregroundStyle(Dex.ink).padding(.vertical, 26)
            }
            Button { store.collectionVisible = true } label: {
                Label("Visit your collection", systemImage: "square.grid.2x2.fill").frame(maxWidth: .infinity)
            }.buttonStyle(HardwareButtonStyle(color: Dex.cream))
            Button("Start a new adventure") { confirmReplay = true }
                .buttonStyle(HardwareButtonStyle(color: Dex.yellow))
                .confirmationDialog("Start a new collection?", isPresented: $confirmReplay, titleVisibility: .visible) {
                    Button("Start again", role: .destructive) { store.replay() }
                } message: { Text("Your 12 discoveries will be cleared.") }
        }.frame(maxWidth: 620)
    }
}
