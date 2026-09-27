import SwiftUI

@main
struct PocketDexApp: App {
    @State private var store = GameStore()
    var body: some Scene {
        WindowGroup {
            PocketDexView(store: store)
                .preferredColorScheme(.light)
        }
    }
}
