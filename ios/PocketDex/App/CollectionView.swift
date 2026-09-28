import SwiftUI
import PocketDexCore

/// Discoveries, drawn on the scanner's own screen: caught Pokémon in colour,
/// the rest as faint numbered silhouettes.
struct CollectionGrid: View {
    let store: GameStore
    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Text("DISCOVERIES")
                Spacer()
                Text("\(store.game.captured.count)/12")
            }
            .font(.system(size: 11, weight: .bold, design: .monospaced)).tracking(1)
            .foregroundStyle(Dex.phosphor.opacity(0.75))
            // Three rows that share the screen's full height, so the grid fills it.
            let rows = stride(from: 0, to: Catalog.all.count, by: 4).map { Array(Catalog.all[$0..<min($0 + 4, Catalog.all.count)]) }
            VStack(spacing: 8) {
                ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                    HStack(spacing: 8) {
                        ForEach(row) { pokemon in tile(pokemon) }
                    }
                    .frame(maxHeight: .infinity)
                }
            }
        }
        .padding(14)
    }

    private func tile(_ pokemon: Pokemon) -> some View {
        let caught = store.game.captured.contains(pokemon.id)
        return VStack(spacing: 4) {
            Group {
                if caught {
                    Image(pokemon.asset).resizable().scaledToFit()
                } else {
                    Image(pokemon.asset).resizable().renderingMode(.template).scaledToFit()
                        .foregroundStyle(Dex.phosphor.opacity(0.14))
                }
            }
            .frame(maxHeight: .infinity)
            .accessibilityHidden(true)
            Text(caught ? pokemon.name.uppercased() : "No.\(pokemon.number)")
                .font(.system(size: 10, weight: .bold, design: .monospaced))
                .foregroundStyle(Dex.phosphor.opacity(caught ? 0.9 : 0.4))
                .lineLimit(1).minimumScaleFactor(0.6)
        }
        .padding(6)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Dex.phosphor.opacity(caught ? 0.09 : 0.03), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(caught ? "\(pokemon.name), discovered" : "Undiscovered Pokémon")
    }
}

struct CompletedPanel: View {
    let store: GameStore
    @Environment(\.dexPower) private var power
    @State private var confirmReplay = false
    var body: some View {
        VStack(spacing: 16) {
            CRTScreen(power: power, radius: Dex.screenRadius) {
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
