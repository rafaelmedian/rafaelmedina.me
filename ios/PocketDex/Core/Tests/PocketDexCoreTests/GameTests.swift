import Foundation
import Testing
@testable import PocketDexCore

@Test func roundsAlwaysHaveFourDistinctValidChoices() {
    for seed in 0..<100 {
        let game = Game(seed: UInt64(seed))
        #expect(game.round.choices.count == 4)
        #expect(Set(game.round.choices).count == 4)
        #expect(game.round.choices.contains(game.round.pokemonID))
        #expect(game.round.choices.allSatisfy { Catalog.pokemon(id: $0) != nil })
    }
}

@Test func wrongAnswerIsDisabledWithoutLosingRound() {
    var game = Game(seed: 42)
    let original = game.round
    let wrong = original.choices.firstIndex { $0 != original.pokemonID }!
    game.select(wrong)
    #expect(game.confirm() == .incorrect)
    #expect(game.round.rejected.contains(wrong))
    #expect(game.captured.isEmpty)
    #expect(game.round.pokemonID == original.pokemonID)
    #expect(game.round.choices == original.choices)
    game.select(wrong)
    #expect(game.confirm() == .ignored)
}

@Test func captureOnlyCountsOnceAndRequiresExplicitAdvance() {
    var game = Game(seed: 4)
    let original = game.round.pokemonID
    game.select(game.round.choices.firstIndex(of: original)!)
    #expect(game.confirm() == .captured)
    #expect(game.captured == [original])
    #expect(game.round.pokemonID == original)
    #expect(game.confirm() == .ignored)
    #expect(game.captured.count == 1)
    game.advance()
    #expect(game.round.pokemonID != original)
    #expect(!game.round.revealed)
}

@Test func dPadNavigatesGridAndSkipsRejectedChoices() {
    var game = Game(seed: 9)
    game.select(0)
    game.move(.right)
    #expect(game.round.selection == 1)
    game.move(.down)
    #expect(game.round.selection == 3)
    game.move(.left)
    #expect(game.round.selection == 2)
    game.move(.up)
    #expect(game.round.selection == 0)
    game.select(-1)
    #expect(game.round.selection == 0)
    game.select(4)
    #expect(game.round.selection == 0)
}

@Test func persistenceRetainsChoicesSelectionAndRejectedAnswers() throws {
    var game = Game(seed: 99)
    let wrong = game.round.choices.firstIndex { $0 != game.round.pokemonID }!
    game.select(wrong)
    _ = game.confirm()
    game.move(.right)
    let data = try game.savedData()
    let restored = Game.restore(data)
    #expect(restored == game)
}

@Test func corruptAndInvalidSavesRecoverSafely() throws {
    #expect(Game.restore(Data("broken".utf8)) == nil)
    let game = Game(seed: 7)
    var object = try #require(JSONSerialization.jsonObject(with: game.savedData()) as? [String: Any])
    var round = try #require(object["round"] as? [String: Any])
    round["choices"] = [1, 1, 1, 1]
    object["round"] = round
    #expect(Game.restore(try JSONSerialization.data(withJSONObject: object)) == nil)
}

@Test func allTwelveCanBeCapturedThenReplayed() {
    var game = Game(seed: 20)
    var seen = Set<Int>()
    for _ in 0..<12 {
        seen.insert(game.round.pokemonID)
        game.select(game.round.choices.firstIndex(of: game.round.pokemonID)!)
        #expect(game.confirm() == .captured)
        game.advance()
    }
    #expect(seen.count == 12)
    #expect(game.isComplete)
    #expect(game.captured.count == 12)
    let completed = game
    game.advance()
    #expect(game == completed)
    game = Game(seed: 20)
    #expect(game.captured.isEmpty)
    #expect(!game.isComplete)
}

@Test func seededDemoIsRepeatable() {
    #expect(Game(seed: 151) == Game(seed: 151))
}
