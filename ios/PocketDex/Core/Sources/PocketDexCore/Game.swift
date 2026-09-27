import Foundation

public enum Direction: Sendable { case up, down, left, right }
public enum AnswerResult: Sendable { case incorrect, captured, ignored }

public struct Round: Codable, Equatable, Sendable {
    public var pokemonID: Int
    public var choices: [Int]
    public var selection = 0
    public var rejected: Set<Int> = []
    public var revealed = false
}

/// Pure game state. Folding, layout, audio, and animation never own progress.
public struct Game: Codable, Equatable, Sendable {
    public private(set) var round: Round
    public private(set) var captured: Set<Int> = []
    public private(set) var isComplete = false
    private var deck: [Int]
    private var random: SeededRandom
    private var version = 1

    public init(seed: UInt64 = UInt64.random(in: 0...UInt64.max)) {
        var generator = SeededRandom(state: seed)
        let order = Catalog.all.map(\.id).shuffled(using: &generator)
        deck = order
        round = Self.makeRound(id: order[0], random: &generator)
        random = generator
    }

    public mutating func select(_ index: Int) {
        guard !round.revealed, !isComplete, round.choices.indices.contains(index),
              !round.rejected.contains(index) else { return }
        round.selection = index
    }

    public mutating func move(_ direction: Direction) {
        guard !round.revealed, !isComplete else { return }
        let current = round.selection
        let candidate: Int
        switch direction {
        case .left, .right: candidate = current ^ 1
        case .up, .down: candidate = current ^ 2
        }
        if !round.rejected.contains(candidate) {
            select(candidate)
        } else if let next = (1...4).map({ (current + $0) % 4 }).first(where: { !round.rejected.contains($0) }) {
            select(next)
        }
    }

    @discardableResult
    public mutating func confirm() -> AnswerResult {
        guard !isComplete, !round.revealed, !round.rejected.contains(round.selection) else { return .ignored }
        if round.choices[round.selection] == round.pokemonID {
            round.revealed = true
            captured.insert(round.pokemonID)
            return .captured
        }
        round.rejected.insert(round.selection)
        return .incorrect
    }

    public mutating func advance() {
        guard round.revealed, !isComplete else { return }
        guard let next = deck.first(where: { !captured.contains($0) }) else {
            isComplete = true
            return
        }
        round = Self.makeRound(id: next, random: &random)
    }

    public func savedData() throws -> Data { try JSONEncoder().encode(self) }

    public static func restore(_ data: Data) -> Game? {
        guard let game = try? JSONDecoder().decode(Self.self, from: data), game.isValid else { return nil }
        return game
    }

    private var isValid: Bool {
        let ids = Set(Catalog.all.map(\.id))
        guard version == 1, deck.count == ids.count, Set(deck) == ids,
              captured.isSubset(of: ids), ids.contains(round.pokemonID),
              round.choices.count == 4, Set(round.choices).count == 4,
              Set(round.choices).isSubset(of: ids), round.choices.contains(round.pokemonID),
              (0..<4).contains(round.selection), round.rejected.isSubset(of: Set(0..<4)),
              !round.rejected.contains(round.choices.firstIndex(of: round.pokemonID)!),
              round.revealed == captured.contains(round.pokemonID),
              !isComplete || captured == ids else { return false }
        let index = deck.firstIndex(of: round.pokemonID)!
        return captured == Set(deck.prefix(index + (round.revealed ? 1 : 0)))
    }

    private static func makeRound(id: Int, random: inout SeededRandom) -> Round {
        let distractors = Catalog.all.map(\.id).filter { $0 != id }.shuffled(using: &random).prefix(3)
        return Round(pokemonID: id, choices: (Array(distractors) + [id]).shuffled(using: &random))
    }
}

private struct SeededRandom: RandomNumberGenerator, Codable, Equatable, Sendable {
    var state: UInt64
    mutating func next() -> UInt64 {
        state &+= 0x9E3779B97F4A7C15
        var value = state
        value = (value ^ (value >> 30)) &* 0xBF58476D1CE4E5B9
        value = (value ^ (value >> 27)) &* 0x94D049BB133111EB
        return value ^ (value >> 31)
    }
}
