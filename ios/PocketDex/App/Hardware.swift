import SwiftUI

/// Where the device puts its camera and its fold, in the reader's space.
struct DeviceRegions: Equatable {
    var camera: CGRect?
    var fold: CGRect?
}

extension GeometryProxy {
    /// The Duo reports its sensor housing as an occlusion region and the
    /// crease as a division region. The Pokédex lens is drawn around the
    /// camera, so the real camera is its pupil. The status strip beside the
    /// camera is an occlusion too, so take the smallest round region.
    var deviceRegions: DeviceRegions {
        #if POCKETDEX_DUO
        func isRound(_ rect: CGRect) -> Bool { abs(rect.width - rect.height) < min(rect.width, rect.height) * 0.25 }
        func area(_ rect: CGRect) -> CGFloat { rect.width * rect.height }
        let camera = reservedRegions(kind: .occlusion).map(\.frame).filter(isRound)
            .min { area($0) < area($1) }
        let fold = reservedRegions(kind: .division).first?.frame
        return DeviceRegions(camera: camera, fold: fold)
        #else
        return DeviceRegions()
        #endif
    }
}

/// The top strip of the Pokédex body: lens, three lights, and the stepped
/// seam below them. The cover and the open body share this geometry, so the
/// strip stays in place when the flap swings away.
struct LensGeometry: Equatable {
    var center: CGPoint
    var pupil: CGFloat
    var diameter: CGFloat

    /// `panel` is the part of the display that carries the strip: the whole
    /// cover, or the stationary half of the open display.
    init(camera: CGRect?, panel: CGRect, safe: EdgeInsets) {
        if let camera, panel.contains(CGPoint(x: camera.midX, y: camera.midY)) {
            center = CGPoint(x: camera.midX, y: camera.midY)
            pupil = max(camera.width, camera.height) + 2
            // Keep clear of the display's rounded corner: the lens stays inside
            // the straight edges with a margin rather than filling the corner.
            let room = min(center.y - panel.minY, panel.maxX - center.x) * 2 - 22
            diameter = min(max(pupil * 1.9, 60), max(room, pupil + 22), 84)
        } else {
            diameter = 76
            pupil = 16
            center = CGPoint(x: panel.maxX - safe.trailing - 24 - diameter / 2, y: panel.minY + safe.top + 14 + diameter / 2)
        }
    }

    /// The open body keeps the lens exactly where the cover had it, measured
    /// from the edge that stays put, so the strip does not move as the flap swings.
    init(anchor: LensAnchor, panel: CGRect) {
        center = CGPoint(x: panel.maxX - anchor.trailing, y: panel.minY + anchor.top)
        pupil = anchor.pupil
        diameter = anchor.diameter
    }

    func anchor(in panel: CGRect) -> LensAnchor {
        LensAnchor(trailing: panel.maxX - center.x, top: center.y - panel.minY, pupil: pupil, diameter: diameter)
    }

    var radius: CGFloat { diameter / 2 }
    /// The strip is deep under the lens and steps up toward the hinge.
    var seamLow: CGFloat { center.y + radius + 16 }
    var seamHigh: CGFloat { center.y + radius * 0.42 }
    var stepOuter: CGFloat { center.x - radius - 30 }
    var stepInner: CGFloat { stepOuter - (seamLow - seamHigh) * 1.25 }
    func light(_ index: Int) -> CGPoint {
        CGPoint(x: center.x - radius - 20 - CGFloat(index) * 25, y: center.y - radius * 0.34)
    }

    /// The body's seam, from the hinge side across to the far edge.
    func seam(hinge: CGFloat, edge: CGFloat) -> [CGPoint] {
        [CGPoint(x: hinge, y: seamHigh), CGPoint(x: stepInner, y: seamHigh),
         CGPoint(x: stepOuter, y: seamLow), CGPoint(x: edge, y: seamLow)]
    }

    /// The same seam seen from the inside of the flap: mirrored across the
    /// fold, because the flap closes over the body with its edge on the step.
    func mirroredSeam(fold: CGRect, edge: CGFloat) -> [CGPoint] {
        seam(hinge: fold.maxX, edge: fold.maxX + (fold.minX - edge))
            .map { CGPoint(x: fold.minX - ($0.x - fold.maxX), y: $0.y) }
    }
}

/// The cover lens, measured from the trailing and top edges.
struct LensAnchor: Codable, Equatable {
    var trailing: CGFloat
    var top: CGFloat
    var pupil: CGFloat
    var diameter: CGFloat
    /// iPhone Duo's outer camera, for launches that open before the cover is seen.
    static let duo = LensAnchor(trailing: 47.8, top: 47.8, pupil: 39, diameter: 73.6)
}

/// A polyline in the display's own coordinates, with softened corners.
struct Polyline: Shape {
    var points: [CGPoint]
    var closed = false
    var corner: CGFloat = 10

    func path(in rect: CGRect) -> Path {
        var path = Path()
        guard points.count > 1 else { return path }
        path.move(to: points[0])
        for index in 1..<points.count {
            let point = points[index]
            let isLast = index == points.count - 1
            if isLast && !closed {
                path.addLine(to: point)
            } else {
                let next = points[(index + 1) % points.count]
                path.addArc(tangent1End: point, tangent2End: next, radius: corner)
            }
        }
        if closed { path.closeSubpath() }
        return path
    }
}

/// The spine between the two halves, after the DS Lite: a bar moulded in
/// the shell's own plastic, split into short end knuckles and a long middle
/// piece. Soft cylinder shading and hairline gaps separate it; no contrast
/// colour, so it reads as part of the case.
struct HingeBarrel: View {
    var vertical = true
    var body: some View {
        let across: UnitPoint = vertical ? .leading : .top
        let along: UnitPoint = vertical ? .trailing : .bottom
        let shading = LinearGradient(stops: [
            .init(color: Dex.redDark, location: 0),
            .init(color: Dex.red, location: 0.22),
            .init(color: Dex.redLight, location: 0.42),
            .init(color: Dex.red, location: 0.62),
            .init(color: Dex.redDark.opacity(0.95), location: 1)
        ], startPoint: across, endPoint: along)
        GeometryReader { proxy in
            let thick = vertical ? proxy.size.width : proxy.size.height
            let length = vertical ? proxy.size.height : proxy.size.width
            let knuckle = min(length * 0.12, 70)
            let gap: CGFloat = 3
            // End knuckle, middle, end knuckle.
            let pieces: [(start: CGFloat, end: CGFloat)] = [
                (0, knuckle), (knuckle + gap, length - knuckle - gap), (length - knuckle, length)
            ]
            ZStack(alignment: .topLeading) {
                ForEach(Array(pieces.enumerated()), id: \.offset) { index, piece in
                    let size = piece.end - piece.start
                    let shape = RoundedRectangle(cornerRadius: thick * 0.32, style: .continuous)
                    shape.fill(shading)
                        .overlay(shape.strokeBorder(LinearGradient(colors: [.white.opacity(0.3), .clear, .black.opacity(0.18)], startPoint: .top, endPoint: .bottom), lineWidth: 1))
                        .overlay {
                            if index != 1 {
                                // Grip rings on the knuckles.
                                let lines = ForEach(0..<3, id: \.self) { _ in
                                    Rectangle().fill(Dex.groove.opacity(0.35))
                                        .frame(width: vertical ? thick * 0.55 : 1.5, height: vertical ? 1.5 : thick * 0.55)
                                }
                                if vertical { VStack(spacing: 3) { lines } } else { HStack(spacing: 3) { lines } }
                            }
                        }
                        .frame(width: vertical ? thick : size, height: vertical ? size : thick)
                        .offset(x: vertical ? 0 : piece.start, y: vertical ? piece.start : 0)
                }
            }

        }.accessibilityHidden(true)
    }
}

/// Lens and lights at their fixed spots on the strip. Choosing a Pokémon
/// sends a glint across the lens; confirming fires the scan flash.
struct LensStrip: View {
    let lens: LensGeometry
    var glow: Double = 1
    var lights: (red: Bool, yellow: Bool, green: Bool) = (false, false, true)
    var glints = 0
    var flashes = 0
    @State private var sweep: CGFloat?
    @State private var flash = 0.0
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    var body: some View {
        ZStack(alignment: .topLeading) {
            CameraLens(diameter: lens.diameter, pupil: lens.pupil, glow: glow, sweep: sweep, flash: flash)
                .position(lens.center)
            LED(color: Color(red: 1, green: 0.22, blue: 0.2), lit: lights.red).position(lens.light(0))
            LED(color: Color(red: 1, green: 0.8, blue: 0.1), lit: lights.yellow).position(lens.light(1))
            LED(color: Color(red: 0.3, green: 0.95, blue: 0.3), lit: lights.green).position(lens.light(2))
        }
        .accessibilityHidden(true)
        .onChange(of: glints) {
            guard !reduceMotion else { return }
            Task {
                // Commit the start state for a frame, or the sweep coalesces away.
                sweep = 0
                try? await Task.sleep(for: .milliseconds(20))
                withAnimation(.easeInOut(duration: 0.5)) { sweep = 1 } completion: { sweep = nil }
            }
        }
        .onChange(of: flashes) {
            // A camera-like pop: instant on, slow falloff. Reduce Motion keeps a gentle glow.
            Task {
                withAnimation(.easeOut(duration: 0.06)) { flash = reduceMotion ? 0.4 : 1 }
                try? await Task.sleep(for: .milliseconds(80))
                withAnimation(.easeOut(duration: reduceMotion ? 0.3 : 0.9)) { flash = 0 }
            }
        }
    }
}

/// The flap is its own moulding: slightly brighter plastic with a lit edge.
struct FlapPlastic: View {
    let outline: [CGPoint]
    var body: some View {
        let shape = Polyline(points: outline, closed: true, corner: 12)
        shape.fill(LinearGradient(stops: [
            .init(color: Dex.redLight.opacity(0.95), location: 0),
            .init(color: Dex.red, location: 0.25),
            .init(color: Dex.redDark, location: 1)
        ], startPoint: .top, endPoint: .bottom))
        .overlay { Grain().clipShape(shape).allowsHitTesting(false) }
        .shadow(color: .black.opacity(0.22), radius: 1.5, y: 1)
    }
}

struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        Path { path in
            path.move(to: CGPoint(x: rect.minX, y: rect.midY))
            path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
            path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
            path.closeSubpath()
        }
    }
}

func smoothstep(_ value: Double, _ low: Double, _ high: Double) -> Double {
    let t = min(max((value - low) / (high - low), 0), 1)
    return t * t * (3 - 2 * t)
}

/// Professor Oak as a tiny original phosphor sprite: swept grey hair, lab
/// coat, red shirt. Drawn from a character map so it stays crisp on the CRT.
struct OakPortrait: View {
    private static let rows = [
        ".....hhhhhh.....",
        "...hhhhhhhhhh...",
        "..hhhhhhhhhhhh..",
        "..hhsssssssshh..",
        "..hssssssssssh..",
        "..sseessssees...",
        "..ssssssssssss..",
        "...sssbsssbss...",
        "...ssssmmssss...",
        "....ssssssss....",
        ".....ssssss.....",
        "...cccsrrsccc...",
        "..ccccsrrscccc..",
        ".ccccccrrcccccc.",
        ".ccccccrrcccccc.",
        ".cccccccccccccc."
    ]
    var body: some View {
        Canvas { context, size in
            let columns = CGFloat(Self.rows[0].count)
            let pixel = min(size.width / columns, size.height / CGFloat(Self.rows.count))
            let origin = CGPoint(x: (size.width - pixel * columns) / 2, y: (size.height - pixel * CGFloat(Self.rows.count)) / 2)
            for (y, row) in Self.rows.enumerated() {
                for (x, character) in row.enumerated() {
                    let level: Double? = switch character {
                    case "h": 0.95
                    case "c": 0.8
                    case "s": 0.5
                    case "r": 0.3
                    case "b", "m": 0.22
                    case "e": 0.08
                    default: nil
                    }
                    guard let level else { continue }
                    let rect = CGRect(x: origin.x + CGFloat(x) * pixel, y: origin.y + CGFloat(y) * pixel, width: pixel - 0.6, height: pixel - 0.6)
                    context.fill(Path(rect), with: .color(Dex.phosphor.opacity(level)))
                }
            }
        }
        .shadow(color: Dex.phosphor.opacity(0.45), radius: 3)
        .accessibilityLabel("Professor Oak")
    }
}
