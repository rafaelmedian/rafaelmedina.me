import SwiftUI

struct PocketDexView: View {
    let store: GameStore
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private var presenting: Bool { store.fold.isOpen && scenePhase == .active && !store.collectionVisible }
    private var presentationID: String { "\(presenting)-\(store.game.round.pokemonID)-\(store.game.round.revealed)" }

    var body: some View {
        ZStack {
            ShellBackground()
                .overlay {
                    // Lighting responds to the hinge; geometry belongs to the
                    // system's arrangement and reserved-region APIs.
                    Color.black.opacity(reduceMotion ? 0 : 0.12 * (1 - min(max(store.hingeAngle, 0), 180) / 180))
                        .allowsHitTesting(false)
                }
                .ignoresSafeArea()
            if store.fold.isOpen {
                openInterior.transition(.opacity)
            } else {
                ClosedCase(store: store).transition(.opacity)
            }
        }
        .animation(reduceMotion ? nil : Dex.quick, value: store.fold.isOpen)
        .modifier(FoldObserver(store: store))
        .task(id: presentationID) {
            if presenting { await store.presentCapture(reduceMotion: reduceMotion) }
        }
        .onChange(of: scenePhase) { _, next in
            if next != .active { store.stopFeedback() }
        }
    }

    private var openInterior: some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                Lens(size: 54)
                VStack(alignment: .leading, spacing: 4) {
                    Text("POCKETDEX").font(.system(size: 17, weight: .black, design: .rounded)).tracking(1).foregroundStyle(Dex.cream)
                    Stencil(text: "THE KANTO FIELD GUIDE", size: 8)
                }
                Spacer(minLength: 0)
                Button { store.toggleMute() } label: {
                    Image(systemName: store.muted ? "speaker.slash.fill" : "speaker.wave.2.fill")
                        .font(.system(size: 14)).foregroundStyle(Dex.cream).frame(width: 44, height: 44).contentShape(Rectangle())
                }.buttonStyle(.plain).accessibilityLabel(store.muted ? "Enable sound" : "Mute sound")
                if store.fold.supportsManualOpening {
                    Button { store.setManualOpen(false) } label: {
                        Image(systemName: "rectangle.portrait.and.arrow.right").font(.system(size: 16)).foregroundStyle(Dex.cream).frame(width: 44, height: 44).contentShape(Rectangle())
                    }.buttonStyle(.plain).accessibilityLabel("Close case").accessibilityIdentifier("close-case")
                }
            }.padding(.horizontal, 20).padding(.vertical, 14)
                .background(Dex.redDark.opacity(0.22))
                .overlay(alignment: .bottom) { Rectangle().fill(Dex.ink).frame(height: 3) }
            ScrollView {
                Group {
                    if store.collectionVisible {
                        CollectionView(store: store)
                    } else if store.game.isComplete {
                        CompletedView(store: store).frame(maxWidth: .infinity)
                    } else {
                        FoldPanels {
                            PokemonPanel(store: store)
                        } secondary: {
                            AnswerPanel(store: store)
                        }
                    }
                }
                .padding(22).frame(maxWidth: 1120).frame(maxWidth: .infinity)
            }.scrollIndicators(.hidden)
                .id(store.collectionVisible ? "collection" : store.game.isComplete ? "completed" : "game")
        }
        .overlay(alignment: .bottomTrailing) {
            #if DEBUG
            if ProcessInfo.processInfo.arguments.contains("--developer") {
                Menu {
                    Button("Reset demo") { store.resetDemo() }
                } label: { Image(systemName: "wrench.adjustable").padding(12).background(Dex.cream, in: Circle()) }
                    .padding(12)
            }
            #endif
        }
    }
}
