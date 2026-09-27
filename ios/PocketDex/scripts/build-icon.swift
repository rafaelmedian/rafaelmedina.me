import AppKit

// Original vector icon, rendered at the App Store source resolution.
let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 1024,
    pixelsHigh: 1024, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
    isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0,
    bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
NSColor(calibratedRed: 0.77, green: 0.19, blue: 0.24, alpha: 1).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: 1024, height: 1024)).fill()
let ink = NSColor(calibratedRed: 0.12, green: 0.16, blue: 0.15, alpha: 1)
let cream = NSColor(calibratedRed: 0.94, green: 0.91, blue: 0.81, alpha: 1)
let seam = NSBezierPath()
seam.move(to: NSPoint(x: 0, y: 600))
seam.line(to: NSPoint(x: 500, y: 600))
seam.line(to: NSPoint(x: 650, y: 750))
seam.line(to: NSPoint(x: 970, y: 750))
seam.line(to: NSPoint(x: 970, y: 90))
seam.lineWidth = 18
ink.setStroke(); seam.stroke()
for (r, color) in [(145.0, ink), (129.0, cream), (108.0, ink), (94.0, NSColor.systemCyan)] {
    color.setFill()
    NSBezierPath(ovalIn: NSRect(x: 250-r, y: 790-r, width: r*2, height: r*2)).fill()
}
NSColor.white.withAlphaComponent(0.8).setFill()
NSBezierPath(ovalIn: NSRect(x: 204, y: 820, width: 65, height: 38)).fill()
for (x, color) in [(475.0, NSColor.systemRed), (565.0, NSColor.systemYellow), (655.0, NSColor.systemGreen)] {
    ink.setFill(); NSBezierPath(ovalIn: NSRect(x: x-24, y: 838, width: 48, height: 48)).fill()
    color.setFill(); NSBezierPath(ovalIn: NSRect(x: x-17, y: 845, width: 34, height: 34)).fill()
}
let triangle = NSBezierPath()
triangle.move(to: NSPoint(x: 95, y: 250)); triangle.line(to: NSPoint(x: 195, y: 340)); triangle.line(to: NSPoint(x: 95, y: 430)); triangle.close()
NSColor.systemYellow.setFill(); triangle.fill(); ink.setStroke(); triangle.lineWidth = 12; triangle.stroke()
let text = "DEX" as NSString
text.draw(at: NSPoint(x: 285, y: 255), withAttributes: [.font: NSFont.systemFont(ofSize: 195, weight: .black), .foregroundColor: cream])
NSGraphicsContext.restoreGraphicsState()
let directory = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
try bitmap.representation(using: .png, properties: [:])!.write(to: directory.appendingPathComponent("AppIcon.png"))
let manifest = """
{"images":[{"filename":"AppIcon.png","idiom":"universal","platform":"ios","size":"1024x1024"}],"info":{"author":"xcode","version":1}}
"""
try manifest.write(to: directory.appendingPathComponent("Contents.json"), atomically: true, encoding: .utf8)
