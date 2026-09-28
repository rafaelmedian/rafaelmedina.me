import SwiftUI

/// Sound, haptics, volume, and starting over, folded into one small key in
/// the scanner's header. Pressing it drops a Control Center–style panel
/// over the glass instead of a system menu, so the options stay on the
/// Pokédex's own screen.
struct SettingsKey: View {
    let store: GameStore
    var body: some View {
        Button { store.settingsVisible.toggle() } label: {
            GlassKeyLabel(icon: store.settingsVisible ? "xmark" : "gearshape.fill")
        }
        .buttonStyle(.plain)
        .accessibilityLabel(store.settingsVisible ? "Close options" : "Options")
        .accessibilityIdentifier("options")
    }
}

/// The dropdown itself: a dimmed screen with the options card hanging
/// from the header's top-right corner, where the key that opened it sits.
struct SettingsDropdown: View {
    let store: GameStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var confirmingReset = false

    private static let gap: CGFloat = 10
    /// Where the card hangs from: just under the header's keys.
    private static let top: CGFloat = 44

    var body: some View {
        GeometryReader { proxy in
            // Tiles are Control Center's 64 points where the glass has room,
            // and shrink on a short scanner so the whole card stays on it.
            let room = proxy.size.height - Self.top - 12 - 28 - 24 - Self.gap
            let tile = min(64, max(room / 2, 40))
            ZStack(alignment: .topTrailing) {
            if store.settingsVisible {
                // Tapping anywhere off the card puts it away.
                Rectangle().fill(.black.opacity(0.5))
                    .contentShape(Rectangle())
                    .onTapGesture { store.settingsVisible = false }
                    .accessibilityHidden(true)
                    .transition(.opacity)
                card(tile: tile)
                    .padding(.top, Self.top).padding(.trailing, 12)
                    .transition(reduceMotion ? .opacity : .scale(scale: 0.2, anchor: .topTrailing).combined(with: .opacity))
            }
            }
            .frame(width: proxy.size.width, height: proxy.size.height, alignment: .topTrailing)
        }
        .animation(reduceMotion ? Dex.quick : .spring(duration: 0.34, bounce: 0.22), value: store.settingsVisible)
        // Starting over wipes the Pokédex, so it asks first.
        .confirmationDialog("Reset your Pokédex?", isPresented: $confirmingReset, titleVisibility: .visible) {
            Button("Reset progress", role: .destructive) {
                store.replay()
                store.settingsVisible = false
            }
        } message: {
            Text("Every discovery is cleared and a new round begins.")
        }
    }

    private func card(tile: CGFloat) -> some View {
        let gap = Self.gap
        return VStack(alignment: .leading, spacing: 12) {
            Text("OPTIONS")
                .font(.system(size: 10, weight: .bold, design: .monospaced)).tracking(1.5)
                .foregroundStyle(Dex.phosphor.opacity(0.55))
                .accessibilityAddTraits(.isHeader)
            HStack(alignment: .top, spacing: gap) {
                VStack(spacing: gap) {
                    HStack(spacing: gap) {
                        ToggleTile(icon: store.muted ? "speaker.slash.fill" : "speaker.wave.2.fill", label: "Sound",
                                   on: !store.muted, size: tile) { store.toggleMute() }
                            .accessibilityIdentifier("sound-toggle")
                        ToggleTile(icon: "iphone.radiowaves.left.and.right", label: "Haptics",
                                   on: store.hapticsOn, size: tile) { store.toggleHaptics() }
                            .accessibilityIdentifier("haptics-toggle")
                    }
                    Button { confirmingReset = true } label: {
                        HStack(spacing: 8) {
                            Image(systemName: "arrow.counterclockwise").font(.system(size: 15, weight: .bold))
                            Text("Reset").font(.system(.footnote, design: .monospaced, weight: .bold))
                        }
                        .foregroundStyle(Dex.redLight)
                        .frame(width: tile * 2 + gap, height: tile)
                        .background(Dex.redLight.opacity(0.1), in: RoundedRectangle(cornerRadius: tile * 0.28, style: .continuous))
                        .overlay(RoundedRectangle(cornerRadius: tile * 0.28, style: .continuous).strokeBorder(Dex.redLight.opacity(0.35), lineWidth: 1))
                        .contentShape(RoundedRectangle(cornerRadius: tile * 0.28, style: .continuous))
                    }
                    .buttonStyle(TilePress())
                    .accessibilityLabel("Reset progress")
                    .accessibilityIdentifier("reset-progress")
                }
                VolumeSlider(store: store, width: tile, height: tile * 2 + gap)
            }
        }
        .padding(14)
        .background(Dex.glass.opacity(0.94), in: RoundedRectangle(cornerRadius: 24, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 24, style: .continuous).strokeBorder(Dex.phosphor.opacity(0.3), lineWidth: 1))
        .shadow(color: .black.opacity(0.6), radius: 18, y: 8)
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("options-panel")
    }
}

/// A round-cornered Control Center toggle: lit phosphor when on, dark glass
/// when off, with its name underneath.
private struct ToggleTile: View {
    let icon: String
    let label: String
    let on: Bool
    let size: CGFloat
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 5) {
                Image(systemName: icon)
                    .font(.system(size: size * 0.31, weight: .semibold))
                    .contentTransition(.symbolEffect(.replace))
                Text(label.uppercased())
                    .font(.system(size: 8, weight: .bold, design: .monospaced)).tracking(0.5)
                    .lineLimit(1).minimumScaleFactor(0.7)
            }
            .padding(.horizontal, 4)
            .foregroundStyle(on ? Dex.glass : Dex.phosphor.opacity(0.75))
            .frame(width: size, height: size)
            .background(on ? Dex.phosphor : Dex.phosphor.opacity(0.08), in: RoundedRectangle(cornerRadius: size * 0.28, style: .continuous))
            .shadow(color: on ? Dex.phosphor.opacity(0.55) : .clear, radius: 8)
            .contentShape(RoundedRectangle(cornerRadius: size * 0.28, style: .continuous))
        }
        .buttonStyle(TilePress())
        .animation(Dex.quick, value: on)
        .accessibilityLabel(label)
        .accessibilityValue(on ? "On" : "Off")
        .accessibilityAddTraits(on ? .isSelected : [])
    }
}

/// Control Center's tall volume capsule: drag anywhere on it to set the
/// level, which fills from the bottom. It plays a tick on release so the
/// new level can be heard.
private struct VolumeSlider: View {
    let store: GameStore
    let width: CGFloat
    let height: CGFloat

    var body: some View {
        let level = store.muted ? 0 : store.volume
        ZStack(alignment: .bottom) {
            Rectangle().fill(Dex.phosphor.opacity(0.08))
            Rectangle().fill(Dex.phosphor).frame(height: height * level)
            Image(systemName: level == 0 ? "speaker.fill" : level < 0.5 ? "speaker.wave.1.fill" : "speaker.wave.3.fill")
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(level > 0.2 ? Dex.glass : Dex.phosphor.opacity(0.75))
                .padding(.bottom, 14)
        }
        .frame(width: width, height: height)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .contentShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { value in store.setVolume(1 - value.location.y / height) }
                .onEnded { _ in store.previewVolume() }
        )
        .accessibilityElement()
        .accessibilityLabel("Volume")
        .accessibilityValue("\(Int((level * 100).rounded())) percent")
        .accessibilityAdjustableAction { direction in
            switch direction {
            case .increment: store.setVolume(level + 0.1)
            case .decrement: store.setVolume(level - 0.1)
            @unknown default: break
            }
            store.previewVolume()
        }
        .accessibilityIdentifier("volume-slider")
    }
}

/// Tiles give a little when pressed, like Control Center's.
private struct TilePress: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed && !reduceMotion ? 0.93 : 1)
            .animation(.spring(duration: 0.2, bounce: 0.3), value: configuration.isPressed)
    }
}
