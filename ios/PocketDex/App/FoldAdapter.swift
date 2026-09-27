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

/// The Duo scheme uses Apple's reserved-region-aware layout. Compatibility
/// builds exercise the same panels without pretending to have a physical hinge.
struct FoldPanels<Primary: View, Secondary: View>: View {
    @ViewBuilder let primary: Primary
    @ViewBuilder let secondary: Secondary
    var body: some View {
        #if POCKETDEX_DUO
        ArrangementView {
            primary
        } secondary: {
            secondary
        }
        .arrangementViewStyle(.split)
        #else
        ViewThatFits(in: .horizontal) {
            HStack(alignment: .top, spacing: 30) {
                primary.frame(minWidth: 290)
                secondary.frame(minWidth: 290)
            }
            VStack(spacing: 22) {
                primary
                secondary
            }
        }
        #endif
    }
}
