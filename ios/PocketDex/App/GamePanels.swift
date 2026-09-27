import SwiftUI
import PocketDexCore

struct PokemonPanel: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        VStack(spacing: 18) {
            HStack {
                Stencil(text: "01 / FIELD SCANNER")
                Spacer()
                Screw()
            }
            VStack(spacing: 12) {
                HStack(spacing: 8) {
                    Indicator(color: Dex.red, lit: store.game.round.revealed)
                    Indicator(color: Dex.yellow, lit: true)
                }
                LCD {
                    VStack(spacing: 8) {
                        HStack {
                            Stencil(text: store.game.round.revealed ? "SIGNAL IDENTIFIED" : "UNKNOWN SIGNAL", size: 10, color: Dex.screenDark)
                            Spacer()
                            Image(systemName: "antenna.radiowaves.left.and.right").font(.caption)
                        }
                        ZStack {
                            Circle().stroke(Dex.screenDark.opacity(0.18), style: StrokeStyle(lineWidth: 1, dash: [3, 4]))
                                .frame(width: 165, height: 165)
                            Circle().stroke(Dex.screenDark.opacity(0.1), lineWidth: 1).frame(width: 125, height: 125)
                            if store.captureStage == .ball {
                                Pokeball().frame(width: 80, height: 80).transition(.scale.combined(with: .opacity))
                            } else {
                                Image(store.pokemon.asset)
                                    .resizable().scaledToFit()
                                    .accessibilityHidden(true)
                                    .saturation(store.game.round.revealed ? 1 : 0)
                                    .brightness(store.game.round.revealed ? 0 : -1)
                                    .opacity(store.game.round.revealed ? 1 : 0.84)
                                    .padding(5)
                                    .shadow(color: Dex.screenDark.opacity(0.2), radius: 1, x: 4, y: 5)
                                    .transition(.opacity)
                            }
                            if store.captureStage == .caught {
                                Image(systemName: "sparkles").font(.title).foregroundStyle(Dex.screenDark)
                                    .offset(x: 78, y: -52).accessibilityHidden(true)
                            }
                        }.frame(height: 174)
                            .accessibilityElement(children: .ignore)
                            .accessibilityLabel(store.game.round.revealed ? store.pokemon.name : "Silhouette of an undiscovered Pokémon. Use the clue to identify it.")
                        Text(store.game.round.revealed ? store.pokemon.name : "Who's that Pokémon?")
                            .font(.system(.title3, design: .rounded, weight: .heavy))
                            .accessibilityIdentifier("pokemon-name")
                        Stencil(text: store.game.round.revealed ? "No. \(store.pokemon.number)  /  \(store.pokemon.type)" : "SCAN • GUESS • DISCOVER", size: 9, color: Dex.screenDark)
                    }.foregroundStyle(Dex.ink)
                }
                HStack {
                    Circle().fill(Dex.red).frame(width: 12, height: 12).overlay(Circle().stroke(Dex.ink, lineWidth: 2))
                    Spacer()
                    Stencil(text: "POCKETDEX OPTICAL SYSTEM", size: 8, color: Dex.ink.opacity(0.7))
                    Spacer()
                    Speaker()
                }
            }
            .padding(15).background(Dex.cream.gradient)
            .clipShape(RoundedRectangle(cornerRadius: 18))
            .overlay(RoundedRectangle(cornerRadius: 18).strokeBorder(Dex.ink, lineWidth: 3))
            .shadow(color: Dex.redDark, radius: 0, x: 2, y: 5)
            HStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 10) {
                    HStack(spacing: 10) {
                        Capsule().fill(Dex.redLight).frame(width: 38, height: 8).overlay(Capsule().strokeBorder(Dex.ink, lineWidth: 2))
                        Capsule().fill(Dex.blue).frame(width: 38, height: 8).overlay(Capsule().strokeBorder(Dex.ink, lineWidth: 2))
                    }.accessibilityHidden(true)
                    LCD {
                        HStack(alignment: .firstTextBaseline, spacing: 4) {
                            Text(String(format: "%02d", store.game.captured.count)).font(.system(size: 34, weight: .medium, design: .monospaced))
                            Text("/12").font(.system(.caption, design: .monospaced))
                        }.foregroundStyle(Dex.ink)
                    }.accessibilityElement(children: .ignore)
                        .accessibilityLabel("\(store.game.captured.count) of 12 Pokémon discovered")
                        .accessibilityIdentifier("capture-count")
                    Stencil(text: "SPECIMENS FOUND", size: 8)
                }
                Spacer(minLength: 0)
                DPad { store.move($0) }.disabled(store.game.round.revealed)
            }
        }
    }
}

struct AnswerPanel: View {
    let store: GameStore
    @Environment(\.dynamicTypeSize) private var typeSize
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            HStack {
                Stencil(text: "02 / IDENTIFICATION")
                Spacer()
                Screw()
            }
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 6) {
                    Circle().fill(Dex.screen).frame(width: 5, height: 5)
                    Stencil(text: "PROFESSOR'S CLUE", size: 9, color: Dex.screen)
                }
                Text(store.pokemon.clue)
                    .font(.system(.body, design: .rounded, weight: .medium))
                    .foregroundStyle(Dex.cream).lineSpacing(3).fixedSize(horizontal: false, vertical: true)
            }.frame(maxWidth: .infinity, minHeight: 94, alignment: .leading)
                .padding(18).background(Dex.ink.gradient)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(.black.opacity(0.6), lineWidth: 3))
                .shadow(color: .white.opacity(0.16), radius: 0, y: 2)
            VStack(alignment: .leading, spacing: 10) {
                Stencil(text: "SELECT A SIGNAL", size: 9)
                LazyVGrid(columns: Array(repeating: .init(.flexible()), count: typeSize.isAccessibilitySize ? 1 : 2), spacing: 12) {
                    ForEach(Array(store.game.round.choices.enumerated()), id: \.offset) { index, id in
                        answer(index: index, id: id)
                    }
                }
            }
            HStack(alignment: .center, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(store.message)
                        .font(.system(.subheadline, design: .rounded, weight: .bold))
                        .foregroundStyle(Dex.cream)
                        .accessibilityIdentifier("round-feedback")
                    Stencil(text: store.game.round.revealed ? "ONE MORE FRIEND." : "TAKE YOUR TIME.", size: 8)
                }.frame(maxWidth: .infinity, alignment: .leading)
                Button { store.confirm() } label: {
                    VStack(spacing: 4) {
                        Image(systemName: store.game.round.revealed ? "arrow.right" : "checkmark").font(.title3.bold())
                        Text(store.game.round.revealed ? "NEXT" : "CONFIRM").font(.system(size: 9, weight: .heavy, design: .monospaced))
                    }.frame(width: 65, height: 57)
                }
                .buttonStyle(HardwareButtonStyle(color: store.canConfirm ? Dex.yellow : Dex.cream.opacity(0.65), round: true))
                .disabled(!store.canConfirm)
                .accessibilityLabel(store.game.round.revealed ? "Next Pokémon" : "Confirm answer")
                .accessibilityIdentifier("confirm-answer")
            }.padding(.top, 4)
            Rectangle().fill(Dex.redDark).frame(height: 2).overlay(alignment: .bottom) { Rectangle().fill(.white.opacity(0.2)).frame(height: 1).offset(y: 2) }
            Button { store.collectionVisible = true } label: {
                HStack(spacing: 10) {
                    Image(systemName: "square.grid.2x2.fill")
                    Text("Your discoveries").font(.system(.subheadline, design: .rounded, weight: .bold))
                    Spacer()
                    Text("\(store.game.captured.count)/12").font(.system(.caption, design: .monospaced, weight: .bold))
                }.frame(maxWidth: .infinity)
            }.buttonStyle(HardwareButtonStyle(color: Dex.cream))
                .accessibilityIdentifier("show-collection")
            HStack {
                Stencil(text: "KANTO RESEARCH DIVISION", size: 8)
                Spacer()
                Speaker()
            }.padding(.top, 4)
        }
    }

    private func answer(index: Int, id: Int) -> some View {
        let rejected = store.game.round.rejected.contains(index)
        let selected = store.game.round.selection == index
        return Button { store.select(index) } label: {
            HStack(spacing: 6) {
                Text(["A", "B", "C", "D"][index]).font(.system(size: 10, weight: .heavy, design: .monospaced))
                    .padding(4).background(Dex.ink.opacity(0.1), in: RoundedRectangle(cornerRadius: 4))
                Text(Catalog.pokemon(id: id)!.name).font(.system(.subheadline, design: .rounded, weight: .bold))
                    .fixedSize(horizontal: false, vertical: true)
                Spacer(minLength: 0)
                if rejected { Image(systemName: "xmark").font(.caption.bold()) }
            }.frame(maxWidth: .infinity, minHeight: 30)
        }
        .buttonStyle(HardwareButtonStyle(color: rejected ? Dex.cream.opacity(0.6) : (selected ? Dex.yellow : Dex.blue), selected: selected))
        .disabled(rejected || store.game.round.revealed)
        .accessibilityLabel(Catalog.pokemon(id: id)!.name)
        .accessibilityValue(rejected ? "Incorrect" : selected ? "Selected" : "")
        .accessibilityAddTraits(selected ? .isSelected : [])
        .accessibilityIdentifier("answer-\(index)")
    }
}

struct DPad: View {
    let move: (Direction) -> Void
    var body: some View {
        VStack(spacing: 0) {
            key(.up, symbol: "chevron.up")
            HStack(spacing: 0) {
                key(.left, symbol: "chevron.left")
                Circle().fill(Dex.ink.gradient).overlay(Circle().strokeBorder(.white.opacity(0.1), lineWidth: 1))
                    .frame(width: 44, height: 44).accessibilityHidden(true)
                key(.right, symbol: "chevron.right")
            }
            key(.down, symbol: "chevron.down")
        }.background {
            Circle().stroke(Dex.redDark.opacity(0.5), lineWidth: 1).padding(-4)
        }
    }
    private func key(_ direction: Direction, symbol: String) -> some View {
        Button { move(direction) } label: {
            Image(systemName: symbol).font(.system(size: 12, weight: .black)).foregroundStyle(Dex.cream)
        }
        .buttonStyle(HardwareButtonStyle(color: Dex.ink))
        .accessibilityLabel("Select \(String(describing: direction))")
    }
}

struct Pokeball: View {
    var body: some View {
        GeometryReader { proxy in
            ZStack {
                Circle().fill(Dex.cream)
                Rectangle().fill(Dex.red).frame(height: proxy.size.height / 2).frame(maxHeight: .infinity, alignment: .top)
                Rectangle().fill(Dex.ink).frame(height: 5)
                Circle().fill(Dex.cream).frame(width: proxy.size.width * 0.3)
                    .overlay(Circle().strokeBorder(Dex.ink, lineWidth: 4))
            }.clipShape(Circle()).overlay(Circle().strokeBorder(Dex.ink, lineWidth: 4))
                .shadow(color: Dex.ink.opacity(0.2), radius: 0, x: 3, y: 5)
        }.accessibilityLabel("Poké Ball")
    }
}
