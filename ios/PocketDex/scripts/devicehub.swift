// Drives Xcode 27.1's Device Hub for the showcase recording.
//
//   swift devicehub.swift window              -> "id x y width height"
//   swift devicehub.swift click X Y           -> click at a point in the window
//   swift devicehub.swift posture closed|half|open
//
// Device Hub has no scripting interface for the hinge, so this posts mouse
// events at its toolbar. The posture buttons sit right of the toolbar's
// centre; points are relative to the device window's top-left corner.
// Posting events needs Accessibility permission for the terminal app.
import CoreGraphics
import Foundation

let deviceName = ProcessInfo.processInfo.environment["POCKETDEX_DEVICE"] ?? "pocketdex-duo"

func deviceWindow() -> (id: Int, frame: CGRect)? {
    let list = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] ?? []
    return list
        .filter { $0[kCGWindowOwnerName as String] as? String == "Device Hub" && $0[kCGWindowName as String] as? String == deviceName }
        .compactMap { info -> (Int, CGRect)? in
            guard let id = info[kCGWindowNumber as String] as? Int,
                  let bounds = info[kCGWindowBounds as String] as? NSDictionary,
                  let frame = CGRect(dictionaryRepresentation: bounds) else { return nil }
            return (id, frame)
        }
        .max { $0.0 < $1.0 }
}

/// Clicks, then parks the pointer on the title bar so it stays out of frame.
func click(_ point: CGPoint, park: CGPoint) {
    func post(_ type: CGEventType, _ at: CGPoint) {
        CGEvent(mouseEventSource: nil, mouseType: type, mouseCursorPosition: at, mouseButton: .left)?.post(tap: .cghidEventTap)
    }
    post(.mouseMoved, point); usleep(90_000)
    post(.leftMouseDown, point); usleep(70_000)
    post(.leftMouseUp, point); usleep(120_000)
    post(.mouseMoved, park)
}

let args = CommandLine.arguments.dropFirst()
guard let window = deviceWindow() else {
    FileHandle.standardError.write("No Device Hub window named \(deviceName). Open the device in Device Hub first.\n".data(using: .utf8)!)
    exit(1)
}
let origin = window.frame.origin
let park = CGPoint(x: window.frame.midX, y: window.frame.minY + 14)
switch args.first {
case "window":
    let f = window.frame
    print(window.id, Int(f.minX), Int(f.minY), Int(f.width), Int(f.height))
case "click":
    let values = args.dropFirst().compactMap(Double.init)
    click(CGPoint(x: origin.x + values[0], y: origin.y + values[1]), park: park)
case "posture":
    let offsets = ["closed": 42.0, "half": 76.0, "open": 110.0]
    guard let name = args.dropFirst().first, let offset = offsets[name] else { exit(2) }
    click(CGPoint(x: window.frame.midX + offset, y: window.frame.maxY - 27), park: park)
default:
    exit(2)
}
