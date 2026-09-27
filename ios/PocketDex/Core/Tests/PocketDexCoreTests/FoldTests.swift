import Testing
@testable import PocketDexCore

@Test func realHingeOverridesManualOpeningAndPreservesLastPose() {
    var fold = FoldState()
    #expect(!fold.isOpen)
    fold.setManualOpen(true)
    #expect(fold.isOpen)
    fold.receive(.closed)
    #expect(!fold.isOpen)
    fold.setManualOpen(true)
    #expect(!fold.isOpen)
    fold.receive(.partiallyOpen)
    #expect(fold.isOpen)
    fold.receive(.fullyOpen)
    #expect(fold.isOpen)
    fold.receive(.unavailable)
    #expect(fold.isOpen)
}

@Test func initialUnavailableHingeOffersManualOpening() {
    var fold = FoldState()
    fold.receive(.unavailable)
    #expect(fold.supportsManualOpening)
    #expect(!fold.isOpen)
    fold.setManualOpen(true)
    #expect(fold.isOpen)
    fold.setManualOpen(false)
    #expect(!fold.isOpen)
}
