public enum FoldPose: Sendable { case unavailable, closed, partiallyOpen, fullyOpen }

/// A missing hinge permits manual opening. Real hinge updates always win.
public struct FoldState: Sendable {
    public private(set) var pose: FoldPose = .unavailable
    private var manualOpen = false
    public init() {}
    public var supportsManualOpening: Bool { pose == .unavailable }
    public var isOpen: Bool {
        switch pose {
        case .unavailable: manualOpen
        case .closed: false
        case .partiallyOpen, .fullyOpen: true
        }
    }
    public mutating func receive(_ next: FoldPose) {
        // Retain presentation if the system briefly loses hinge availability.
        manualOpen = isOpen
        pose = next
    }
    public mutating func setManualOpen(_ open: Bool) {
        guard supportsManualOpening else { return }
        manualOpen = open
    }
}
