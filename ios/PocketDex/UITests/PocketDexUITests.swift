import XCTest

@MainActor
final class PocketDexUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["--ui-testing", "--demo", "--reset", "--awake"]
        XCUIDevice.shared.orientation = .portrait
    }

    func testOpenCloseAndCollectionPreserveRound() {
        app.launch()
        XCTAssertTrue(app.buttons["open-case"].waitForExistence(timeout: 10))
        attach("01-closed-case")
        app.buttons["open-case"].tap()
        XCTAssertTrue(app.staticTexts["pokemon-name"].waitForExistence(timeout: 5))
        XCTAssertEqual(app.staticTexts["pokemon-name"].label, "Who's that Pokémon?")
        attach("02-open-scanner")
        reveal(app.buttons["answer-0"])
        let choices = (0..<4).map { app.buttons["answer-\($0)"].label }
        reveal(app.buttons["answer-1"])
        app.buttons["answer-1"].tap()
        XCTAssertEqual(app.buttons["answer-1"].value as? String, "Selected")
        app.buttons["close-case"].tap()
        XCTAssertTrue(app.buttons["open-case"].waitForExistence(timeout: 3))
        app.buttons["open-case"].tap()
        reveal(app.buttons["answer-0"])
        XCTAssertEqual((0..<4).map { app.buttons["answer-\($0)"].label }, choices)
        reveal(app.buttons["answer-1"])
        XCTAssertEqual(app.buttons["answer-1"].value as? String, "Selected")
        reveal(app.buttons["show-collection"])
        app.buttons["show-collection"].tap()
        XCTAssertTrue(app.buttons["back-to-game"].waitForExistence(timeout: 3))
        attach("03-collection")
        app.buttons["back-to-game"].tap()
        reveal(app.buttons["answer-1"])
        XCTAssertEqual(app.buttons["answer-1"].value as? String, "Selected")
    }

    func testCaptureRetriesPersistenceAndNextRound() {
        app.launch()
        app.buttons["open-case"].tap()
        // Seed 151 is a fixed recording fixture; identity is asserted separately.
        let correct = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'answer-' AND label == %@", "Gengar")).firstMatch
        reveal(correct)
        XCTAssertTrue(correct.waitForExistence(timeout: 5))
        let wrong = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'answer-' AND label != %@", "Gengar")).firstMatch
        reveal(wrong)
        // One tap answers: no OK needed.
        wrong.tap()
        XCTAssertFalse(wrong.isEnabled)
        XCTAssertTrue(app.staticTexts["Not quite. Try another!"].exists)
        reveal(correct)
        correct.tap()
        app.buttons["close-case"].tap()
        app.buttons["open-case"].tap()
        XCTAssertTrue(app.buttons["next-pokemon"].waitForExistence(timeout: 3))
        let ready = NSPredicate(format: "enabled == true")
        expectation(for: ready, evaluatedWith: app.buttons["next-pokemon"])
        waitForExpectations(timeout: 5)
        XCTAssertEqual(app.staticTexts["pokemon-name"].label, "Gengar")
        attach("04-captured")
        XCUIDevice.shared.press(.home)
        app.activate()
        XCTAssertEqual(app.staticTexts["pokemon-name"].label, "Gengar")
        app.terminate()
        app.launchArguments = ["--ui-testing", "--demo"]
        app.launch()
        app.buttons["open-case"].tap()
        XCTAssertEqual(app.staticTexts["pokemon-name"].label, "Gengar")
        let count = app.descendants(matching: .any).matching(identifier: "capture-count").firstMatch
        XCTAssertEqual(count.label, "1 of 12 Pokémon discovered")
        reveal(app.buttons["next-pokemon"])
        app.buttons["next-pokemon"].tap()
        XCTAssertEqual(app.staticTexts["pokemon-name"].label, "Who's that Pokémon?")
    }

    func testRotationAndLargeTypeKeepControlsReachable() {
        app.launchArguments += ["-UIPreferredContentSizeCategoryName", "UICTContentSizeCategoryAccessibilityXXXL"]
        app.launch()
        reveal(app.buttons["open-case"])
        app.buttons["open-case"].tap()
        reveal(app.buttons["answer-0"])
        XCTAssertTrue(app.buttons["answer-0"].isHittable)
        XCUIDevice.shared.orientation = .landscapeLeft
        reveal(app.buttons["show-collection"])
        if !app.buttons["show-collection"].isHittable { print(app.debugDescription); attach("large-type-failure") }
        XCTAssertTrue(app.buttons["show-collection"].isHittable)
        app.buttons["show-collection"].tap()
        XCTAssertTrue(app.buttons["back-to-game"].waitForExistence(timeout: 5))
        attach("05-large-type-landscape")
    }

    /// Reproducible, human-paced capture of the actual compatibility app.
    func testShowcaseRecording() {
        app.launch()
        XCTAssertTrue(app.buttons["open-case"].waitForExistence(timeout: 10))
        attach("showcase-closed")
        Thread.sleep(forTimeInterval: 1.5) // Deliberate beats for the recording.
        app.buttons["open-case"].tap()
        XCTAssertTrue(app.staticTexts["pokemon-name"].waitForExistence(timeout: 5))
        attach("showcase-open")
        Thread.sleep(forTimeInterval: 1.5)
        let correct = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'answer-' AND label == %@", "Gengar")).firstMatch
        reveal(correct)
        correct.tap()
        expectation(for: NSPredicate(format: "enabled == true"), evaluatedWith: app.buttons["next-pokemon"])
        waitForExpectations(timeout: 5)
        attach("showcase-captured")
        Thread.sleep(forTimeInterval: 1.5)
        // Poke the screen: the Pokémon answers, as Mist does.
        let art = app.descendants(matching: .any).matching(identifier: "scanner-art").firstMatch
        reveal(art)
        art.tap()
        XCTAssertTrue(app.staticTexts["Gengar vanished for a second. Rude."].waitForExistence(timeout: 2))
        attach("showcase-poke")
        reveal(app.buttons["Options"])
        app.buttons["Options"].tap()
        XCTAssertTrue(app.buttons["Mute sound"].waitForExistence(timeout: 3))
        attach("showcase-options")
        reveal(app.buttons["show-collection"])
        app.buttons["show-collection"].tap()
        XCTAssertTrue(app.buttons["back-to-game"].waitForExistence(timeout: 5))
        attach("showcase-collection")
        Thread.sleep(forTimeInterval: 1.5)
        app.buttons["back-to-game"].tap()
        app.buttons["close-case"].tap()
        XCTAssertTrue(app.buttons["open-case"].waitForExistence(timeout: 5))
        Thread.sleep(forTimeInterval: 1.5)
    }

    /// Runs on the iPhone Duo with the device already unfolded: plays a round on
    /// the touchscreen and captures each state.
    func testDuoTour() throws {
        app.launchArguments = ["--ui-testing", "--demo", "--reset"]
        app.launch()
        if app.buttons["open-case"].waitForExistence(timeout: 3) { throw XCTSkip("Needs an unfolded iPhone Duo.") }
        // It opens asleep, as Mist does.
        XCTAssertTrue(app.buttons["wake-up"].waitForExistence(timeout: 10))
        Thread.sleep(forTimeInterval: 1.5)
        attach("duo-asleep")
        app.buttons["wake-up"].tap()
        XCTAssertTrue(app.buttons["answer-0"].waitForExistence(timeout: 5))
        Thread.sleep(forTimeInterval: 2)
        attach("duo-open")
        // One tap answers: no OK needed.
        app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'answer-' AND label == %@", "Meowth")).firstMatch.tap()
        Thread.sleep(forTimeInterval: 0.6)
        attach("duo-wrong")
        app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'answer-' AND label == %@", "Gengar")).firstMatch.tap()
        let next = app.buttons["next-pokemon"]
        XCTAssertTrue(next.waitForExistence(timeout: 3))
        expectation(for: NSPredicate(format: "enabled == true"), evaluatedWith: next)
        waitForExpectations(timeout: 5)
        Thread.sleep(forTimeInterval: 1)
        attach("duo-identified")
        app.descendants(matching: .any).matching(identifier: "scanner-art").firstMatch.tap()
        Thread.sleep(forTimeInterval: 0.3)
        attach("duo-poke")
        app.buttons["show-collection"].tap()
        Thread.sleep(forTimeInterval: 0.6)
        attach("duo-collection")
        app.buttons["back-to-game"].tap()
        next.tap()
        XCTAssertTrue(app.buttons["answer-0"].waitForExistence(timeout: 3))
        Thread.sleep(forTimeInterval: 1)
        attach("duo-next-round")
        app.buttons["sleep"].tap()
        XCTAssertTrue(app.buttons["wake-up"].waitForExistence(timeout: 3))
        Thread.sleep(forTimeInterval: 1)
        attach("duo-slept")
    }

    /// Touching the silhouette reads the entry one hint at a time, then
    /// strikes out a wrong answer.
    func testDuoHints() throws {
        app.launchArguments = ["--ui-testing", "--demo", "--reset"]
        app.launch()
        if app.buttons["open-case"].waitForExistence(timeout: 3) { throw XCTSkip("Needs an unfolded iPhone Duo.") }
        XCTAssertTrue(app.buttons["wake-up"].waitForExistence(timeout: 10))
        app.buttons["wake-up"].tap()
        let art = app.descendants(matching: .any).matching(identifier: "scanner-art").firstMatch
        let data = app.descendants(matching: .any).matching(identifier: "scan-data").firstMatch
        XCTAssertTrue(art.waitForExistence(timeout: 5))
        XCTAssertFalse(data.label.contains("GHOST"))
        art.tap()
        XCTAssertTrue(data.label.localizedCaseInsensitiveContains("ghost"), data.label)
        Thread.sleep(forTimeInterval: 1)
        attach("duo-hint-type")
        let struck = NSPredicate(format: "identifier BEGINSWITH 'answer-' AND value == %@", "Incorrect")
        XCTAssertEqual(app.buttons.matching(struck).count, 0)
        // Spaced out, so the Pokémon doesn't think it's being pestered.
        for _ in 0..<4 {
            Thread.sleep(forTimeInterval: 0.8)
            art.tap()
        }
        XCTAssertTrue(data.label.contains("G·····"), data.label)
        XCTAssertEqual(app.buttons.matching(struck).count, 1)
        XCTAssertNotEqual(app.buttons.matching(struck).firstMatch.label, "Gengar")
        Thread.sleep(forTimeInterval: 0.4)
        attach("duo-hints-all")
    }

    /// Scan mode on the unfolded Duo: wake into the camera, scan, get a match.
    func testDuoScan() throws {
        app.launchArguments = ["--ui-testing", "--demo", "--reset"]
        app.launch()
        if app.buttons["open-case"].waitForExistence(timeout: 3) { throw XCTSkip("Needs an unfolded iPhone Duo.") }
        XCTAssertTrue(app.buttons["wake-scan"].waitForExistence(timeout: 10))
        Thread.sleep(forTimeInterval: 1)
        attach("duo-wake-choice")
        app.buttons["wake-scan"].tap()
        XCTAssertTrue(app.buttons["scan-button"].waitForExistence(timeout: 5))
        Thread.sleep(forTimeInterval: 2)
        attach("duo-scan-ready")
        app.buttons["scan-button"].tap()
        Thread.sleep(forTimeInterval: 0.9)
        attach("duo-scanning")
        XCTAssertTrue(app.descendants(matching: .any).matching(identifier: "scan-result").firstMatch.waitForExistence(timeout: 5))
        Thread.sleep(forTimeInterval: 0.8)
        attach("duo-scan-match")
        // Back to the game without going through sleep.
        app.buttons["back-to-guess"].tap()
        XCTAssertTrue(app.buttons["answer-0"].waitForExistence(timeout: 3))
        app.buttons["sleep"].tap()
        XCTAssertTrue(app.buttons["wake-scan"].waitForExistence(timeout: 3))
    }

    /// The Pokémon is made of pixels: a pinch squishes it, and a hard squeeze
    /// swaps it to another of its pictures. Mostly for the screenshots.
    func testSqueeze() throws {
        app.launch()
        // Off the Duo the case opens by hand.
        if app.buttons["open-case"].waitForExistence(timeout: 3) { app.buttons["open-case"].tap() }
        let art = app.descendants(matching: .any).matching(identifier: "scanner-art").firstMatch
        XCTAssertTrue(art.waitForExistence(timeout: 5))
        art.pinch(withScale: 0.5, velocity: -0.6)
        Thread.sleep(forTimeInterval: 1.2)
        attach("squeeze-silhouette")
        let correct = app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'answer-' AND label == %@", "Gengar")).firstMatch
        reveal(correct)
        correct.tap()
        let next = app.buttons["next-pokemon"]
        expectation(for: NSPredicate(format: "enabled == true"), evaluatedWith: next)
        waitForExpectations(timeout: 8)
        reveal(art)
        Thread.sleep(forTimeInterval: 1)
        attach("squeeze-before")
        art.press(forDuration: 1.2)
        Thread.sleep(forTimeInterval: 1.2)
        attach("squeeze-held")
        art.pinch(withScale: 0.45, velocity: -0.5)
        Thread.sleep(forTimeInterval: 1.2)
        attach("squeeze-pinched")
        art.pinch(withScale: 0.45, velocity: -0.5)
        Thread.sleep(forTimeInterval: 1.2)
        attach("squeeze-again")
    }

    /// Options → Reset progress asks first, then clears every discovery.
    func testDuoResetProgress() throws {
        app.launchArguments = ["--ui-testing", "--demo", "--reset"]
        app.launch()
        if app.buttons["open-case"].waitForExistence(timeout: 3) { throw XCTSkip("Needs an unfolded iPhone Duo.") }
        XCTAssertTrue(app.buttons["wake-up"].waitForExistence(timeout: 10))
        app.buttons["wake-up"].tap()
        app.buttons.matching(NSPredicate(format: "identifier BEGINSWITH 'answer-' AND label == %@", "Gengar")).firstMatch.tap()
        let count = app.descendants(matching: .any).matching(identifier: "capture-count").firstMatch
        expectation(for: NSPredicate(format: "label == %@", "1 of 12 Pokémon discovered"), evaluatedWith: count)
        waitForExpectations(timeout: 5)
        app.buttons["Options"].tap()
        XCTAssertTrue(app.buttons["Reset progress"].waitForExistence(timeout: 3))
        app.buttons["Reset progress"].tap()
        // The confirmation's own Reset progress button.
        let confirm = app.buttons.matching(identifier: "Reset progress").element(boundBy: 0)
        XCTAssertTrue(confirm.waitForExistence(timeout: 3))
        Thread.sleep(forTimeInterval: 0.5)
        attach("duo-reset-confirm")
        confirm.tap()
        expectation(for: NSPredicate(format: "label == %@", "0 of 12 Pokémon discovered"), evaluatedWith: count)
        waitForExpectations(timeout: 5)
        XCTAssertTrue(app.buttons["answer-0"].waitForExistence(timeout: 3))
    }

    private func reveal(_ element: XCUIElement) {
        let scroll = app.scrollViews.firstMatch
        // The cover is a fixed layout; only the open panels scroll.
        guard scroll.exists else { return }
        for _ in 0..<12 {
            let viewport = scroll.frame.insetBy(dx: 0, dy: 16)
            if element.exists && element.isHittable && viewport.contains(element.frame) { return }
            let moveDown = element.exists && element.frame.midY < viewport.minY
            let start = scroll.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: moveDown ? 0.25 : 0.8))
            let end = scroll.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: moveDown ? 0.8 : 0.25))
            start.press(forDuration: 0.05, thenDragTo: end)
        }
    }

    private func attach(_ name: String) {
        let screenshot = app.screenshot()
        // Simulator runs also drop a PNG on the host, for reviewing without a result bundle.
        if let home = ProcessInfo.processInfo.environment["SIMULATOR_HOST_HOME"] {
            let folder = URL(fileURLWithPath: home).appending(path: "Library/Caches/PocketDexShots")
            try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
            try? screenshot.pngRepresentation.write(to: folder.appending(path: "\(name).png"))
            // The Duo's inner display screenshots black here; hold still so a host
            // capture of the Device Hub window can catch this state.
            if name.hasPrefix("duo-") { Thread.sleep(forTimeInterval: 1.2) }
        }
        let attachment = XCTAttachment(screenshot: screenshot)
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
