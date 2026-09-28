import Foundation

public struct Pokemon: Identifiable, Sendable {
    public let id: Int
    public let name: String
    public let clue: String
    public let type: String
    /// Species label, height in metres, and weight in kilograms.
    public let species: String
    public let height: Double
    public let weight: Double
    public var asset: String { String(format: "pokemon-%03d", id) }
    public var number: String { String(format: "%03d", id) }
}

public enum Catalog {
    public static let all: [Pokemon] = [
        .init(id: 1, name: "Bulbasaur", clue: "A little seed rides on my back. We grow up together.", type: "GRASS / POISON", species: "Seed", height: 0.7, weight: 6.9),
        .init(id: 4, name: "Charmander", clue: "The flame on my tail tells you how I'm feeling.", type: "FIRE", species: "Lizard", height: 0.6, weight: 8.5),
        .init(id: 7, name: "Squirtle", clue: "I carry my shelter everywhere. My best trick is a water jet.", type: "WATER", species: "Tiny Turtle", height: 0.5, weight: 9.0),
        .init(id: 25, name: "Pikachu", clue: "My rosy cheeks store a shocking amount of energy.", type: "ELECTRIC", species: "Mouse", height: 0.4, weight: 6.0),
        .init(id: 39, name: "Jigglypuff", clue: "Stay awake for my song. Please. Just this once.", type: "NORMAL / FAIRY", species: "Balloon", height: 0.5, weight: 5.5),
        .init(id: 52, name: "Meowth", clue: "I have a coin on my forehead and an eye for shiny things.", type: "NORMAL", species: "Scratch Cat", height: 0.4, weight: 4.2),
        .init(id: 54, name: "Psyduck", clue: "My head aches. When it gets bad, something psychic happens.", type: "WATER", species: "Duck", height: 0.8, weight: 19.6),
        .init(id: 72, name: "Tentacool", clue: "I drift through the sea on two tentacles, with red gems on my head.", type: "WATER / POISON", species: "Jellyfish", height: 0.9, weight: 45.5),
        .init(id: 94, name: "Gengar", clue: "That grin in your shadow? It might be mine.", type: "GHOST / POISON", species: "Shadow", height: 1.5, weight: 40.5),
        .init(id: 129, name: "Magikarp", clue: "For now, I mostly splash. Just wait until I grow up.", type: "WATER", species: "Fish", height: 0.9, weight: 10.0),
        .init(id: 133, name: "Eevee", clue: "One fluffy collar. So many different ways to evolve.", type: "NORMAL", species: "Evolution", height: 0.3, weight: 6.5),
        .init(id: 143, name: "Snorlax", clue: "Eat. Sleep. Block a road. Repeat.", type: "NORMAL", species: "Sleeping", height: 2.1, weight: 460.0)
    ]
    public static func pokemon(id: Int) -> Pokemon? { all.first { $0.id == id } }
}
