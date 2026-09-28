import SwiftUI
import PocketDexCore

/// The flap as one low-res CRT touchscreen, after Mist's control panel:
/// Professor Oak's clue on top and four coloured answer pills below.
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
                .frame(minHeight: 56, maxHeight: 112)
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

/// The scanner's bottom strip, drawn on its glass: the small trackpad that
/// steers the Pokémon above it, a readout of what it said or the round's
/// feedback, the two settings, and sleep.
struct ControlStrip: View {
    let store: GameStore

    var body: some View {
        HStack(spacing: 8) {
            Trackpad(store: store)
                .frame(width: Self.height)
            readoutTile
            // Two small switches, stacked in the corner.
            VStack(spacing: 6) {
                settingTile(icon: store.muted ? "speaker.slash.fill" : "speaker.wave.2.fill", label: "SOUND", on: !store.muted) { store.toggleMute() }
                    .accessibilityLabel(store.muted ? "Enable sound" : "Mute sound")
                settingTile(icon: "waveform.path", label: "HAPTIC", on: store.hapticsOn) { store.toggleHaptics() }
                    .accessibilityLabel(store.hapticsOn ? "Turn off haptics" : "Turn on haptics")
            }
            .frame(width: 58)
            sleepTile
        }
        .frame(height: Self.height)
    }

    /// Height of the strip, and so the trackpad's side.
    static let height: CGFloat = 84

    private var sleepTile: some View {
        Button { store.sleep() } label: {
            VStack(spacing: 6) {
                Image(systemName: "moon.zzz.fill").font(.system(size: 16, weight: .bold))
                Text("SLEEP").font(.system(size: 9, weight: .heavy, design: .monospaced))
            }
            .foregroundStyle(Dex.phosphor.opacity(0.8))
            .frame(width: 58)
            .frame(maxHeight: .infinity)
            .background(Dex.phosphor.opacity(0.08), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
            .contentShape(Rectangle())
        }
        .buttonStyle(GlassPress())
        .accessibilityLabel("Put PocketDex to sleep")
        .accessibilityIdentifier("sleep")
    }

    /// What the Pokémon just said, or the round's feedback.
    private var readoutTile: some View {
        let idle = store.message == GameStore.idleMessage
        let line = store.reaction ?? (idle ? "Tap the screen to say hi." : store.message)
        return VStack(alignment: .leading, spacing: 4) {
            Text(store.reaction != nil ? "IT SAYS" : "STATUS")
                .font(.system(size: 9, weight: .bold, design: .monospaced)).tracking(1.5)
                .foregroundStyle(Dex.phosphor.opacity(0.5))
            Text(line)
                .font(.system(.footnote, design: .monospaced, weight: .semibold))
                .foregroundStyle(store.reaction != nil ? Dex.yellow : Dex.phosphor)
                .lineLimit(3).minimumScaleFactor(0.75)
                .accessibilityIdentifier(store.reaction == nil && !idle ? "round-feedback" : "readout")
            Spacer(minLength: 0)
        }
        .padding(10)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        .animation(Dex.quick, value: line)
    }

    /// `label` names the switch for tests and VoiceOver; the tile shows only its icon.
    private func settingTile(icon: String, label: String, on: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: icon).font(.system(size: 14, weight: .bold))
            .foregroundStyle(on ? Dex.glass : Dex.phosphor.opacity(0.6))
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(on ? Dex.phosphor : Dex.phosphor.opacity(0.08), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
            .shadow(color: on ? Dex.phosphor.opacity(0.5) : .clear, radius: 4)
            .contentShape(Rectangle())
        }
        .buttonStyle(GlassPress())
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

/// Scan mode's touchscreen: one big SCAN button and a way back to sleep.
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
                Button { store.sleep() } label: {
                    VStack(spacing: 4) {
                        Image(systemName: "moon.zzz.fill").font(.system(size: 16, weight: .bold))
                        Text("SLEEP").font(.system(size: 9, weight: .heavy, design: .monospaced))
                    }
                    .foregroundStyle(Dex.phosphor.opacity(0.8))
                    .frame(width: 72)
                    .frame(maxHeight: .infinity)
                    .background(Dex.phosphor.opacity(0.08), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .contentShape(Rectangle())
                }
                .buttonStyle(GlassPress())
                .accessibilityIdentifier("sleep")
            }
            .frame(height: 64)
        }
        .padding(12)
    }
}

/// The found message: the Pokémon, a line of praise, and the way to the next.
private struct FoundCard: View {
    let store: GameStore
    var body: some View {
        let caught = store.captureStage == .caught
        HStack(spacing: 14) {
            Image(store.pokemon.asset).resizable().scaledToFit()
                .frame(width: 96, height: 96)
                .shadow(color: .white.opacity(0.3), radius: 8)
                .accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 8) {
                Text("YOU FOUND IT!")
                    .font(.system(size: 12, weight: .heavy, design: .monospaced)).tracking(2)
                    .foregroundStyle(Color(red: 0.45, green: 1, blue: 0.5))
                Text(store.pokemon.name)
                    .font(.system(.title, design: .rounded, weight: .heavy))
                    .foregroundStyle(Dex.phosphor)
                Button { store.confirm() } label: {
                    HStack(spacing: 8) {
                        Text(caught ? "Next Pokémon" : "Registering…")
                        Image(systemName: "arrow.right")
                    }
                    .font(.system(.headline, design: .rounded, weight: .heavy))
                    .foregroundStyle(.black.opacity(0.75))
                    .padding(.horizontal, 18)
                    .frame(height: 48)
                    .background(Color(red: 0.24, green: 0.72, blue: 0.34).opacity(caught ? 1 : 0.4), in: Capsule())
                    .contentShape(Capsule())
                }
                .buttonStyle(GlassPress())
                .disabled(!caught)
                .accessibilityIdentifier("next-pokemon")
            }
            Spacer(minLength: 0)
        }
        .padding(16)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Dex.phosphor.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}

/// Drag the knob and the Pokémon on the main screen turns to look that way;
/// a quick flick moves the answer selection instead; tap it to poke. When the Pokémon is
/// touched on the main screen, the knob jiggles in sympathy.
private struct Trackpad: View {
    let store: GameStore
    @State private var knob: CGSize = .zero
    @State private var jiggles = 0
    @State private var dragStart: Date?
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        GeometryReader { proxy in
            let side = min(proxy.size.width, proxy.size.height)
            let travel = side * 0.28
            ZStack {
                RoundedRectangle(cornerRadius: 14, style: .continuous).fill(Dex.phosphor.opacity(0.07))
                ForEach([0.0, 90, 180, 270], id: \.self) { angle in
                    Triangle().fill(Dex.phosphor.opacity(0.45)).frame(width: 9, height: 11)
                        .offset(x: -side * 0.4)
                        .rotationEffect(.degrees(angle))
                }
                Circle().strokeBorder(Dex.phosphor.opacity(0.25), lineWidth: 5).frame(width: side * 0.44, height: side * 0.44)
                Circle().fill(RadialGradient(colors: [.white, Dex.phosphor], center: UnitPoint(x: 0.4, y: 0.35), startRadius: 0, endRadius: side * 0.2))
                    .frame(width: side * 0.3, height: side * 0.3)
                    .shadow(color: Dex.phosphor.opacity(0.7), radius: 8)
                    .offset(knob)
                    .keyframeAnimator(initialValue: 0.0, trigger: jiggles) { view, x in view.offset(x: x) } keyframes: { _ in
                        KeyframeTrack {
                            CubicKeyframe(-5, duration: 0.05)
                            CubicKeyframe(5, duration: 0.07)
                            CubicKeyframe(-3, duration: 0.07)
                            CubicKeyframe(0, duration: 0.08)
                        }
                    }
            }
            .frame(width: side, height: side)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .contentShape(Rectangle())
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        if dragStart == nil { dragStart = .now }
                        let t = value.translation
                        let length = max(hypot(t.width, t.height), 0.001)
                        let scale = min(1, travel / length)
                        knob = CGSize(width: t.width * scale, height: t.height * scale)
                        store.gaze = CGSize(width: knob.width / travel, height: knob.height / travel)
                    }
                    .onEnded { value in
                        let t = value.translation
                        let quick = Date.now.timeIntervalSince(dragStart ?? .now) < 0.35
                        dragStart = nil
                        if hypot(t.width, t.height) < 8 {
                            store.poke()
                        } else if quick && !store.game.round.revealed {
                            // A flick moves the selection, like a D-pad press.
                            let direction: Direction = abs(t.width) > abs(t.height) ? (t.width > 0 ? .right : .left) : (t.height > 0 ? .down : .up)
                            store.move(direction)
                        }
                        withAnimation(reduceMotion ? nil : .spring(response: 0.35, dampingFraction: 0.45)) {
                            knob = .zero
                            store.gaze = .zero
                        }
                    }
            )
        }
        .onChange(of: store.pokes) { if !reduceMotion { jiggles += 1 } }
        .accessibilityElement()
        .accessibilityLabel("Trackpad")
        .accessibilityHint("Swipe to move the selection. Tap to poke the Pokémon.")
        .accessibilityAction(named: "Up") { store.move(.up) }
        .accessibilityAction(named: "Down") { store.move(.down) }
        .accessibilityAction(named: "Left") { store.move(.left) }
        .accessibilityAction(named: "Right") { store.move(.right) }
        .accessibilityAction(named: "Poke") { store.poke() }
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
