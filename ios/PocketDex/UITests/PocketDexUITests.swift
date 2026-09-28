import XCTest

@MainActor
final class PocketDexUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUp() {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments = ["--ui-testing", "--demo", "--reset"]
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
        wrong.tap()
        reveal(app.buttons["confirm-answer"])
        app.buttons["confirm-answer"].tap()
        XCTAssertFalse(wrong.isEnabled)
        XCTAssertTrue(app.staticTexts["Not quite. Try another!"].exists)
        reveal(correct)
        correct.tap()
        app.buttons["confirm-answer"].tap()
        app.buttons["close-case"].tap()
        app.buttons["open-case"].tap()
        XCTAssertTrue(app.buttons["confirm-answer"].waitForExistence(timeout: 3))
        let ready = NSPredicate(format: "enabled == true")
        expectation(for: ready, evaluatedWith: app.buttons["confirm-answer"])
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
        reveal(app.buttons["confirm-answer"])
        app.buttons["confirm-answer"].tap()
        XCTAssertEqual(app.staticTexts["pokemon-name"].label, "Who's that Pokémon?")
    }

    func testRotationAndLargeTypeKeepControlsReachable() {
        app.launchArguments += ["-UIPreferredContentSizeCategoryName", "UICTContentSizeCategoryAccessibilityXXXL"]
        app.launch()
        reveal(app.buttons["open-case"])
        app.buttons["open-case"].tap()
        reveal(app.buttons["confirm-answer"])
        XCTAssertTrue(app.buttons["confirm-answer"].isHittable)
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
        reveal(app.buttons["confirm-answer"])
        app.buttons["confirm-answer"].tap()
        expectation(for: NSPredicate(format: "enabled == true"), evaluatedWith: app.buttons["confirm-answer"])
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
        reveal(app.buttons["camera"])
        app.buttons["camera"].tap()
        XCTAssertTrue(app.buttons["Share snapshot"].waitForExistence(timeout: 3))
        attach("showcase-snapshot")
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
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
