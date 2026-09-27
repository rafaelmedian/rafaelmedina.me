import SwiftUI
import PocketDexCore

struct FoldObserver: ViewModifier {
    let store: GameStore
    func body(content: Content) -> some View {
        #if POCKETDEX_DUO
        content.onHingeChange { _, context in
            guard let hinge = context.hinge else {
                store.receivePose(.unavailable, angle: 180)
                return
            }
            let pose: FoldPose
            switch hinge.status {
            case .closed: pose = .closed
            case .partiallyOpen: pose = .partiallyOpen
            case .fullyOpen: pose = .fullyOpen
            default: pose = .unavailable
            }
            store.receivePose(pose, angle: hinge.angle.degrees)
        }
        #else
        content
        #endif
    }
}
