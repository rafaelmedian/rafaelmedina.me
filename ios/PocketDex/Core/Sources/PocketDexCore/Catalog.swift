import Foundation

public struct Pokemon: Identifiable, Sendable {
    public let id: Int
    public let name: String
    public let clue: String
    public let type: String
    public var asset: String { String(format: "pokemon-%03d", id) }
    public var number: String { String(format: "%03d", id) }
}

public enum Catalog {
    public static let all: [Pokemon] = [
        .init(id: 1, name: "Bulbasaur", clue: "A little seed rides on my back. We grow up together.", type: "GRASS / POISON"),
        .init(id: 4, name: "Charmander", clue: "The flame on my tail tells you how I'm feeling.", type: "FIRE"),
        .init(id: 7, name: "Squirtle", clue: "I carry my shelter everywhere. My best trick is a water jet.", type: "WATER"),
        .init(id: 25, name: "Pikachu", clue: "My rosy cheeks store a shocking amount of energy.", type: "ELECTRIC"),
        .init(id: 39, name: "Jigglypuff", clue: "Stay awake for my song. Please. Just this once.", type: "NORMAL / FAIRY"),
        .init(id: 52, name: "Meowth", clue: "I have a coin on my forehead and an eye for shiny things.", type: "NORMAL"),
        .init(id: 54, name: "Psyduck", clue: "My head aches. When it gets bad, something psychic happens.", type: "WATER"),
        .init(id: 72, name: "Tentacool", clue: "I drift through the sea on two tentacles, with red gems on my head.", type: "WATER / POISON"),
        .init(id: 94, name: "Gengar", clue: "That grin in your shadow? It might be mine.", type: "GHOST / POISON"),
        .init(id: 129, name: "Magikarp", clue: "For now, I mostly splash. Just wait until I grow up.", type: "WATER"),
        .init(id: 133, name: "Eevee", clue: "One fluffy collar. So many different ways to evolve.", type: "NORMAL"),
        .init(id: 143, name: "Snorlax", clue: "Eat. Sleep. Block a road. Repeat.", type: "NORMAL")
    ]
    public static func pokemon(id: Int) -> Pokemon? { all.first { $0.id == id } }
}
