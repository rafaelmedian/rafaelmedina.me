import SwiftUI

/// Where the device puts its camera and its fold, in the reader's space.
struct DeviceRegions: Equatable {
    var camera: CGRect?
    var fold: CGRect?
    /// Every sensor housing, including ones the system currently marks inactive.
    var sensors: [CGRect] = []
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
        let sensors = reservedRegions(kind: .occlusion, options: .includeInactive).map(\.frame)
        return DeviceRegions(camera: camera, fold: fold, sensors: sensors)
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
            let room = min(center.y - panel.minY, panel.maxX - center.x) * 2 - 8
            diameter = min(max(pupil * 2.4, 64), max(room, pupil + 26), 100)
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
    static let duo = LensAnchor(trailing: 47.8, top: 47.8, pupil: 39, diameter: 87.6)
}

/// A dark glass window over a sensor housing the lens does not cover.
struct SensorWindow: View {
    let rect: CGRect
    var body: some View {
        let r = rect.insetBy(dx: -7, dy: -5)
        Capsule().fill(Dex.glass)
            .overlay(Capsule().strokeBorder(.white.opacity(0.16), lineWidth: 1).padding(1))
            .overlay(Capsule().strokeBorder(Dex.groove, lineWidth: 2).padding(-2))
            .shadow(color: .white.opacity(0.25), radius: 0, y: 1.5)
            .frame(width: r.width, height: r.height)
            .position(x: r.midX, y: r.midY)
            .accessibilityHidden(true)
    }
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

/// The spine between the two halves: a cream barrel split into knuckles.
struct HingeBarrel: View {
    var vertical = true
    var body: some View {
        let shading = LinearGradient(stops: [
            .init(color: Dex.bezelShade, location: 0),
            .init(color: Dex.bezel, location: 0.3),
            .init(color: .white, location: 0.45),
            .init(color: Dex.bezel, location: 0.62),
            .init(color: Color(white: 0.52), location: 1)
        ], startPoint: vertical ? .leading : .top, endPoint: vertical ? .trailing : .bottom)
        GeometryReader { proxy in
            let length = vertical ? proxy.size.height : proxy.size.width
            let breaks = [0.16, 0.2, 0.8, 0.84].map { length * $0 }
            ZStack {
                Capsule().fill(shading)
                Capsule().fill(Dex.red.opacity(0.9)).frame(width: vertical ? 3 : nil, height: vertical ? nil : 3)
                    .padding(vertical ? .vertical : .horizontal, length * 0.24)
                ForEach(Array(breaks.enumerated()), id: \.offset) { _, at in
                    Rectangle().fill(Dex.groove.opacity(0.75))
                        .frame(width: vertical ? proxy.size.width : 1.5, height: vertical ? 1.5 : proxy.size.height)
                        .overlay(Rectangle().fill(.white.opacity(0.6)).frame(width: vertical ? proxy.size.width : 1, height: vertical ? 1 : proxy.size.height).offset(x: vertical ? 0 : 1.5, y: vertical ? 1.5 : 0))
                        .position(x: vertical ? proxy.size.width / 2 : at, y: vertical ? at : proxy.size.height / 2)
                }
            }
            .clipShape(Capsule())
            .shadow(color: .black.opacity(0.35), radius: 3, x: vertical ? 1 : 0, y: vertical ? 0 : 2)
        }.accessibilityHidden(true)
    }
}

/// Lens and lights at their fixed spots on the strip.
struct LensStrip: View {
    let lens: LensGeometry
    var glow: Double = 1
    var lights: (red: Bool, yellow: Bool, green: Bool) = (false, false, true)
    var body: some View {
        ZStack(alignment: .topLeading) {
            CameraLens(diameter: lens.diameter, pupil: lens.pupil, glow: glow)
                .position(lens.center)
            LED(color: Color(red: 1, green: 0.22, blue: 0.2), lit: lights.red).position(lens.light(0))
            LED(color: Color(red: 1, green: 0.8, blue: 0.1), lit: lights.yellow).position(lens.light(1))
            LED(color: Color(red: 0.3, green: 0.95, blue: 0.3), lit: lights.green).position(lens.light(2))
        }.accessibilityHidden(true)
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
        .shadow(color: .black.opacity(0.28), radius: 6, y: 3)
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
