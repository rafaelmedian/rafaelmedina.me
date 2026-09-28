import SwiftUI
import PocketDexCore
import AVFoundation
import UIKit

@MainActor @Observable
final class GameStore {
    enum CaptureStage { case hidden, reveal, ball, caught }
    private(set) var game: Game
    var fold = FoldState()
    var hingeAngle: Double = 180
    var collectionVisible = false
    var captureStage: CaptureStage = .hidden
    var message = GameStore.idleMessage
    var muted = false
    var hapticsOn = true
    static let idleMessage = "A wild mystery appeared."
    /// Where the cover drew its lens, so the open body can draw it in the same place.
    var lensAnchor: LensAnchor? {
        didSet {
            guard lensAnchor != oldValue, let lensAnchor, let data = try? JSONEncoder().encode(lensAnchor) else { return }
            defaults.set(data, forKey: "pocketdex.lens")
        }
    }
    /// Bumped when the selection moves; the lens answers with a glint.
    private(set) var selectionGlints = 0
    /// Bumped when an answer is confirmed; the lens fires its scan flash.
    private(set) var scanFlashes = 0
    /// Counts rejected guesses so the hardware can flash on each one.
    private(set) var wrongAnswers = 0
    private let defaults: UserDefaults
    private let saveKey = "pocketdex.progress.v1"
    private let feedback = Feedback()

    init() {
        let arguments = ProcessInfo.processInfo.arguments
        #if DEBUG
        defaults = arguments.contains("--ui-testing") ? UserDefaults(suiteName: "PocketDexUITests")! : .standard
        if arguments.contains("--reset") {
            defaults.removeObject(forKey: saveKey)
            // Settings go back to their defaults too: sound and haptics on.
            defaults.removeObject(forKey: "pocketdex.muted")
            defaults.removeObject(forKey: "pocketdex.hapticsOff")
        }
        let seed: UInt64 = arguments.contains("--demo") ? 151 : UInt64.random(in: 0...UInt64.max)
        #else
        defaults = .standard
        let seed = UInt64.random(in: 0...UInt64.max)
        #endif
        game = defaults.data(forKey: saveKey).flatMap(Game.restore) ?? Game(seed: seed)
        captureStage = game.round.revealed ? .caught : .hidden
        if game.round.revealed { message = "Registered. A new friend!" }
        muted = defaults.bool(forKey: "pocketdex.muted")
        hapticsOn = !defaults.bool(forKey: "pocketdex.hapticsOff")
        lensAnchor = defaults.data(forKey: "pocketdex.lens").flatMap { try? JSONDecoder().decode(LensAnchor.self, from: $0) }
    }

    var pokemon: Pokemon { Catalog.pokemon(id: game.round.pokemonID)! }
    var canConfirm: Bool {
        !game.isComplete && (game.round.revealed ? captureStage == .caught : !game.round.rejected.contains(game.round.selection))
    }

    func select(_ index: Int) {
        let before = game.round.selection
        game.select(index)
        if game.round.selection != before {
            selectionGlints += 1
            play("select", haptic: .selection)
        }
        save()
    }

    func move(_ direction: Direction) {
        let before = game.round.selection
        game.move(direction)
        if game.round.selection != before { selectionGlints += 1 }
        play("select", haptic: .selection)
        save()
    }

    func confirm() {
        guard canConfirm else { return }
        if game.round.revealed {
            game.advance()
            captureStage = .hidden
            message = Self.idleMessage
            play("select", haptic: .selection)
        } else {
            scanFlashes += 1
            switch game.confirm() {
            case .incorrect:
                message = "Not quite. Try another!"
                wrongAnswers += 1
                play("wrong", haptic: .error)
            case .captured:
                captureStage = .reveal
                message = "It's \(pokemon.name)!"
                play("select", haptic: .selection)
            case .ignored: break
            }
        }
        save()
    }

    /// Cancellation preserves the stage; resume continues without another award.
    func presentCapture(reduceMotion: Bool) async {
        guard game.round.revealed, captureStage != .caught else { return }
        do {
            try Task.checkCancellation()
            if reduceMotion {
                finishCapture()
                return
            }
            if captureStage == .reveal {
                try await Task.sleep(for: .milliseconds(650))
                try Task.checkCancellation()
                withAnimation(Dex.reveal) { captureStage = .ball }
            }
            if captureStage == .ball {
                try await Task.sleep(for: .milliseconds(850))
                try Task.checkCancellation()
                withAnimation(Dex.reveal) { finishCapture() }
            }
        } catch { /* Closing or backgrounding pauses presentation, never progress. */ }
    }

    private func finishCapture() {
        guard captureStage != .caught else { return }
        captureStage = .caught
        message = "Registered. A new friend!"
        play("capture", haptic: .success)
    }

    func setManualOpen(_ open: Bool) {
        let wasOpen = fold.isOpen
        fold.setManualOpen(open)
        didChangeOpen(from: wasOpen)
    }

    func receivePose(_ pose: FoldPose, angle: Double) {
        let wasOpen = fold.isOpen
        fold.receive(pose)
        hingeAngle = angle
        didChangeOpen(from: wasOpen)
    }

    private func didChangeOpen(from wasOpen: Bool) {
        guard wasOpen != fold.isOpen else { return }
        feedback.stop()
        play(fold.isOpen ? "open" : "close", haptic: .impact)
    }

    func stopFeedback() { feedback.stop() }

    func toggleMute() {
        muted.toggle()
        defaults.set(muted, forKey: "pocketdex.muted")
        if muted { feedback.stop() }
    }

    func toggleHaptics() {
        hapticsOn.toggle()
        defaults.set(!hapticsOn, forKey: "pocketdex.hapticsOff")
        if hapticsOn { UISelectionFeedbackGenerator().selectionChanged() }
    }

    func replay() {
        game = Game()
        captureStage = .hidden
        collectionVisible = false
        message = Self.idleMessage
        save()
    }

    #if DEBUG
    func resetDemo() {
        game = Game(seed: 151)
        captureStage = .hidden
        collectionVisible = false
        message = Self.idleMessage
        save()
    }
    #endif

    private func save() {
        if let data = try? game.savedData() { defaults.set(data, forKey: saveKey) }
    }
    private func play(_ name: String, haptic: Feedback.Haptic) {
        feedback.play(name, audible: !muted, haptic: hapticsOn ? haptic : nil)
    }
}

@MainActor
private final class Feedback {
    enum Haptic { case selection, impact, success, error }
    private var player: AVAudioPlayer?
    func play(_ name: String, audible: Bool, haptic: Haptic?) {
        switch haptic {
        case nil: break
        case .selection: UISelectionFeedbackGenerator().selectionChanged()
        case .impact: UIImpactFeedbackGenerator(style: .soft).impactOccurred()
        case .success: UINotificationFeedbackGenerator().notificationOccurred(.success)
        case .error: UINotificationFeedbackGenerator().notificationOccurred(.error)
        }
        guard audible, let url = Bundle.main.url(forResource: name, withExtension: "wav") else { return }
        // Ambient respects the silent switch and mixes with the user's music.
        try? AVAudioSession.sharedInstance().setCategory(.ambient)
        player = try? AVAudioPlayer(contentsOf: url)
        player?.volume = 0.55
        player?.play()
    }
    func stop() { player?.stop() }
}
