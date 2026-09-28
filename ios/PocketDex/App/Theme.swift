import SwiftUI

/// Soft, matte plastics lit from above. Parts read through tone, depth, and
/// hairline grooves rather than outlines.
enum Dex {
    static let red = Color(red: 0.86, green: 0.21, blue: 0.24)
    static let redLight = Color(red: 0.95, green: 0.36, blue: 0.36)
    static let redDark = Color(red: 0.63, green: 0.11, blue: 0.15)
    static let groove = Color(red: 0.33, green: 0.04, blue: 0.07)
    static let lining = Color(red: 0.20, green: 0.03, blue: 0.05)
    static let ink = Color(red: 0.09, green: 0.09, blue: 0.11)
    static let cream = Color(red: 0.97, green: 0.95, blue: 0.91)
    static let bezel = Color(red: 0.92, green: 0.91, blue: 0.89)
    static let bezelShade = Color(red: 0.71, green: 0.70, blue: 0.69)
    static let glass = Color(red: 0.035, green: 0.04, blue: 0.05)
    static let phosphor = Color(red: 0.80, green: 1.0, blue: 0.84)
    static let screen = Color(red: 0.62, green: 0.84, blue: 0.40)
    static let screenDark = Color(red: 0.13, green: 0.26, blue: 0.10)
    static let blue = Color(red: 0.26, green: 0.53, blue: 0.95)
    static let yellow = Color(red: 1.0, green: 0.79, blue: 0.22)
    static let quick = Animation.easeOut(duration: 0.16)
    static let reveal = Animation.spring(duration: 0.36, bounce: 0.15)
    /// Mist's squeeze: a fast press and a release that overshoots a little.
    static let squeeze = Animation.spring(duration: 0.24, bounce: 0.42)
}

/// A keycap's plastic: the face, the darker skirt under it, and the legend.
struct KeyTint: Equatable {
    var face: Color
    var top: Color
    var skirt: Color
    var legend: Color

    static let blue = KeyTint(face: Dex.blue, top: Color(red: 0.42, green: 0.66, blue: 1.0),
                              skirt: Color(red: 0.13, green: 0.30, blue: 0.66), legend: Color(red: 0.05, green: 0.16, blue: 0.40))
    static let yellow = KeyTint(face: Dex.yellow, top: Color(red: 1.0, green: 0.88, blue: 0.48),
                                skirt: Color(red: 0.76, green: 0.49, blue: 0.05), legend: Color(red: 0.42, green: 0.25, blue: 0.0))
    static let cream = KeyTint(face: Dex.cream, top: .white,
                               skirt: Color(red: 0.70, green: 0.66, blue: 0.60), legend: Color(red: 0.32, green: 0.29, blue: 0.26))
    static let ink = KeyTint(face: Color(red: 0.17, green: 0.17, blue: 0.19), top: Color(red: 0.30, green: 0.30, blue: 0.33),
                             skirt: Color(red: 0.03, green: 0.03, blue: 0.04), legend: Color(red: 0.72, green: 0.72, blue: 0.74))
    static let red = KeyTint(face: Color(red: 0.93, green: 0.27, blue: 0.27), top: Color(red: 1.0, green: 0.48, blue: 0.45),
                             skirt: Color(red: 0.52, green: 0.07, blue: 0.10), legend: Color(red: 0.40, green: 0.03, blue: 0.06))
    static let spent = KeyTint(face: Color(red: 0.72, green: 0.70, blue: 0.70), top: Color(red: 0.82, green: 0.80, blue: 0.80),
                               skirt: Color(red: 0.46, green: 0.44, blue: 0.44), legend: Color(red: 0.36, green: 0.34, blue: 0.34))
}

/// How far the fold has powered the Pokédex, 0 (dark) to 1 (awake).
private struct DexPowerKey: EnvironmentKey { static let defaultValue: Double = 1 }
extension EnvironmentValues {
    var dexPower: Double {
        get { self[DexPowerKey.self] }
        set { self[DexPowerKey.self] = newValue }
    }
}

struct Stencil: View {
    let text: String
    var size: CGFloat = 11
    var color: Color = Dex.cream
    var body: some View {
        Text(text).font(.system(size: size, weight: .bold, design: .monospaced))
            .tracking(1.5).foregroundStyle(color)
    }
}

/// Lettering pressed into the shell: a dark cut with a lit lower lip.
struct Engraved: View {
    let text: String
    var size: CGFloat = 10
    var body: some View {
        Text(text).font(.system(size: size, weight: .heavy, design: .rounded)).tracking(1.2)
            .foregroundStyle(Dex.groove.opacity(0.62))
            .shadow(color: .white.opacity(0.28), radius: 0, x: 0, y: 1)
    }
}

struct ShellBackground: View {
    var body: some View {
        LinearGradient(stops: [
            .init(color: Dex.redLight, location: 0),
            .init(color: Dex.red, location: 0.28),
            .init(color: Dex.redDark, location: 1)
        ], startPoint: .top, endPoint: .bottom)
        .overlay { Grain().allowsHitTesting(false).accessibilityHidden(true) }
    }
}

/// Fine speckle that stops large plastic fields looking like flat fills.
struct Grain: View {
    var body: some View {
        Canvas { context, size in
            for index in 0..<2200 {
                let x = CGFloat((index * 73 + 17) % 997) / 997 * size.width
                let y = CGFloat((index * 137 + 59) % 991) / 991 * size.height
                let dot = CGRect(x: x, y: y, width: 0.8, height: 0.8)
                context.fill(Path(ellipseIn: dot), with: .color(index.isMultiple(of: 2) ? .white.opacity(0.07) : .black.opacity(0.08)))
            }
        }
    }
}

extension Shape {
    /// A seam between two plastic parts: a dark cut with a lit lower lip.
    func groove(_ width: CGFloat = 2) -> some View {
        ZStack {
            stroke(.white.opacity(0.26), style: StrokeStyle(lineWidth: 1, lineCap: .round, lineJoin: .round)).offset(y: width * 0.5 + 0.8)
            stroke(Dex.groove.opacity(0.9), style: StrokeStyle(lineWidth: width, lineCap: .round, lineJoin: .round))
        }
    }
}

struct Screw: View {
    var body: some View {
        Circle().fill(LinearGradient(colors: [Dex.redDark, Dex.groove], startPoint: .top, endPoint: .bottom))
            .overlay(Circle().fill(Dex.groove).frame(width: 5, height: 1.2).rotationEffect(.degrees(-35)))
            .overlay(Circle().strokeBorder(.white.opacity(0.18), lineWidth: 0.75).offset(y: 0.6))
            .frame(width: 8, height: 8).accessibilityHidden(true)
    }
}

/// Mist's speaker: two rows of drilled holes.
struct DotGrille: View {
    var rows = 2
    var columns = 10
    var dot: CGFloat = 4.5
    var gap: CGFloat = 4
    var color: Color = Dex.groove
    var body: some View {
        VStack(spacing: gap) {
            ForEach(0..<rows, id: \.self) { _ in
                HStack(spacing: gap) {
                    ForEach(0..<columns, id: \.self) { _ in
                        Circle().fill(color.opacity(0.85)).frame(width: dot, height: dot)
                            .shadow(color: .white.opacity(0.25), radius: 0, y: 0.8)
                    }
                }
            }
        }.accessibilityHidden(true)
    }
}

/// A glass bead in a dark socket; lit beads bloom.
struct LED: View {
    let color: Color
    var lit = true
    var size: CGFloat = 13
    var body: some View {
        ZStack {
            Circle().fill(Dex.groove).frame(width: size + 5, height: size + 5)
                .overlay(Circle().strokeBorder(.white.opacity(0.2), lineWidth: 0.75).offset(y: 0.8))
            Circle().fill(RadialGradient(colors: [lit ? .white.opacity(0.95) : color.opacity(0.55), color.opacity(lit ? 1 : 0.5), color.opacity(lit ? 0.8 : 0.25)],
                                         center: UnitPoint(x: 0.38, y: 0.32), startRadius: 0, endRadius: size * 0.72))
                .overlay(Circle().fill(Color.black.opacity(lit ? 0 : 0.35)))
                .frame(width: size, height: size)
            Ellipse().fill(.white.opacity(lit ? 0.85 : 0.35)).frame(width: size * 0.32, height: size * 0.2)
                .offset(x: -size * 0.14, y: -size * 0.22)
        }
        .shadow(color: lit ? color.opacity(0.85) : .clear, radius: size * 0.55)
        .animation(Dex.quick, value: lit)
        .accessibilityHidden(true)
    }
}

/// The Pokédex eye, built around the device's own camera: the hardware
/// camera sits inside `pupil`, so it reads as the lens.
struct CameraLens: View {
    var diameter: CGFloat = 80
    var pupil: CGFloat = 20
    /// Glass glow, 0 asleep to 1 awake.
    var glow: Double = 1
    /// A glint crossing the glass, 0 (left) to 1 (right); nil when idle.
    var sweep: CGFloat? = nil
    /// The scan flash, 0 off to 1 fully lit.
    var flash: Double = 0
    var body: some View {
        let d = diameter
        ZStack {
            Circle().fill(.black.opacity(0.35)).blur(radius: 4).offset(y: 3)
            Circle().fill(AngularGradient(colors: [.white, Color(white: 0.72), Color(white: 0.97), Color(white: 0.62), .white], center: .center, angle: .degrees(-40)))
            Circle().fill(LinearGradient(colors: [Color(white: 0.55), Color(white: 0.96)], startPoint: .top, endPoint: .bottom))
                .padding(d * 0.055)
            Circle().fill(Dex.ink).padding(d * 0.085)
            Circle().fill(RadialGradient(colors: [Color(red: 0.36, green: 0.86, blue: 1.0), Color(red: 0.05, green: 0.46, blue: 0.82), Color(red: 0.02, green: 0.13, blue: 0.30)],
                                         center: UnitPoint(x: 0.36, y: 0.3), startRadius: 0, endRadius: d * 0.5))
                .padding(d * 0.11)
            Circle().strokeBorder(Color(red: 0.55, green: 0.95, blue: 1.0).opacity(0.15 + 0.7 * glow), lineWidth: 1.5)
                .padding(d * 0.2)
                .shadow(color: .cyan.opacity(0.9 * glow), radius: 6 * glow)
            if let sweep {
                // A soft bar of light travelling across the glass.
                ZStack {
                    Rectangle().fill(LinearGradient(colors: [.clear, .white.opacity(0.95), .clear], startPoint: .leading, endPoint: .trailing))
                        .frame(width: d * 0.34, height: d * 1.4)
                        .rotationEffect(.degrees(24))
                        .offset(x: (sweep - 0.5) * d * 1.2)
                }
                .frame(width: d, height: d)
                .clipShape(Circle().inset(by: d * 0.11))
                .blendMode(.plusLighter)
            }
            Circle().fill(Color(red: 0.75, green: 0.97, blue: 1.0).opacity(0.85 * flash))
                .padding(d * 0.11)
                .blendMode(.plusLighter)
            Circle().fill(.black).frame(width: pupil, height: pupil)
                .overlay(Circle().strokeBorder(Color(red: 0.2, green: 0.5, blue: 0.7).opacity(0.5), lineWidth: 1).padding(-2))
            Ellipse().fill(.white.opacity(0.82)).frame(width: d * 0.24, height: d * 0.12)
                .rotationEffect(.degrees(-38)).offset(x: -d * 0.19, y: -d * 0.2)
            Circle().fill(.white.opacity(0.4)).frame(width: d * 0.06).offset(x: d * 0.2, y: d * 0.22)
        }
        .frame(width: d, height: d)
        .background(Circle().fill(Color.cyan.opacity(0.55 * flash)).blur(radius: 18).scaleEffect(1 + 0.5 * flash))
        .accessibilityHidden(true)
    }
}

/// A Mist keycap: the face rides on a same-hue skirt and sinks into it.
/// Keys start sunk when the Pokédex is dark and rise, in order, as it wakes.
extension RectangleCornerRadii {
    static func all(_ r: CGFloat) -> RectangleCornerRadii { .init(topLeading: r, bottomLeading: r, bottomTrailing: r, topTrailing: r) }
}

struct KeyCapStyle: ButtonStyle {
    var tint: KeyTint = .blue
    var depth: CGFloat = 7
    var corners = RectangleCornerRadii(topLeading: 14, bottomLeading: 14, bottomTrailing: 14, topTrailing: 14)
    var latched = false
    /// Power level at which this key rises.
    var wake: Double = 0.5
    @Environment(\.dexPower) private var power
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func makeBody(configuration: Configuration) -> some View {
        let asleep = power < wake
        let travel: CGFloat = configuration.isPressed || asleep ? depth * 0.8 : (latched ? depth * 0.42 : 0)
        let shape = UnevenRoundedRectangle(cornerRadii: corners, style: .continuous)
        return configuration.label
            .foregroundStyle(tint.legend)
            .padding(.horizontal, 12).padding(.vertical, 10)
            .frame(minWidth: 44, minHeight: 44)
            .background {
                shape.fill(LinearGradient(colors: [tint.top, tint.face, tint.face], startPoint: .top, endPoint: .bottom))
                    .overlay(shape.strokeBorder(LinearGradient(colors: [.white.opacity(0.55), .white.opacity(0)], startPoint: .top, endPoint: .center), lineWidth: 1))
                    .overlay(shape.strokeBorder(tint.skirt.opacity(0.45), lineWidth: 0.75))
                    .overlay { if latched { shape.inset(by: 3.5).strokeBorder(.white.opacity(0.85), lineWidth: 2) } }
            }
            .brightness(asleep ? -0.18 : 0)
            .offset(y: travel)
            .background {
                shape.fill(LinearGradient(colors: [tint.skirt.opacity(0.9), tint.skirt], startPoint: .top, endPoint: .bottom))
                    .offset(y: depth)
                    .shadow(color: .black.opacity(0.3), radius: 3, y: depth + 1)
            }
            .padding(.bottom, depth)
            .contentShape(Rectangle())
            .animation(reduceMotion ? nil : Dex.squeeze, value: configuration.isPressed)
            .animation(reduceMotion ? nil : Dex.squeeze, value: asleep)
            .animation(reduceMotion ? nil : Dex.squeeze, value: latched)
    }
}

/// A legend printed in a small engraved box, as on Mist's mood keys.
struct KeyLegend: View {
    let text: String
    var color: Color
    var body: some View {
        Text(text).font(.system(size: 10, weight: .bold, design: .rounded)).tracking(0.6)
            .foregroundStyle(color.opacity(0.85))
            .padding(.horizontal, 5).padding(.vertical, 2)
            .overlay(RoundedRectangle(cornerRadius: 5, style: .continuous).strokeBorder(color.opacity(0.4), lineWidth: 1))
    }
}

/// A plain round button: a domed cap on its own shallow skirt, no well.
struct ArcadeButtonStyle: ButtonStyle {
    var tint: KeyTint = .yellow
    var armed = true
    var size: CGFloat = 96
    var wake: Double = 0.8
    @Environment(\.dexPower) private var power
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func makeBody(configuration: Configuration) -> some View {
        let asleep = power < wake
        let sink: CGFloat = configuration.isPressed || asleep ? 4 : 0
        let cap = size * 0.78
        return ZStack {
            Circle().fill(tint.skirt).frame(width: cap, height: cap).offset(y: 5)
                .shadow(color: .black.opacity(0.3), radius: 3, y: 6)
            Circle().fill(RadialGradient(colors: [tint.top, tint.face], center: UnitPoint(x: 0.4, y: 0.3), startRadius: 0, endRadius: cap * 0.6))
                .overlay(Circle().strokeBorder(.white.opacity(0.5), lineWidth: 1).padding(1))
                .overlay(Circle().strokeBorder(tint.skirt.opacity(0.35), lineWidth: 1).padding(cap * 0.14))
                .frame(width: cap, height: cap)
                .offset(y: sink)
            configuration.label.foregroundStyle(tint.legend).offset(y: sink)
        }
        .frame(width: size, height: size)
        .saturation(armed ? 1 : 0.35)
        .brightness(asleep ? -0.15 : 0)
        .contentShape(Rectangle())
        .animation(reduceMotion ? nil : Dex.squeeze, value: configuration.isPressed)
        .animation(reduceMotion ? nil : Dex.squeeze, value: asleep)
    }
}

/// Dark glass with a dot-matrix mask, vignette, and bloom. `power` runs the
/// CRT: dark, a dot, a bright line, then the full picture.
struct CRTScreen<Content: View>: View {
    var power: Double = 1
    var radius: CGFloat = 18
    var pitch: CGFloat = 3
    @ViewBuilder var content: Content

    var body: some View {
        let p = min(max(power, 0), 1)
        let width = min(1, p / 0.18)
        let height = max(0.012, min(1, (p - 0.18) / 0.5))
        let flash = (1 - height) * (p > 0.001 ? 1 : 0)
        ZStack {
            Dex.glass
            ZStack {
                content
                Rectangle().fill(Dex.phosphor).opacity(flash * 0.95)
            }
            .scaleEffect(x: width, y: height)
            .opacity(p > 0.001 ? 1 : 0)
            DotMask(pitch: pitch).allowsHitTesting(false)
            RadialGradient(colors: [.clear, .black.opacity(0.55)], center: .center, startRadius: 40, endRadius: 420)
                .allowsHitTesting(false)
            LinearGradient(colors: [.white.opacity(0.07), .clear], startPoint: .top, endPoint: .center).allowsHitTesting(false)
        }
        .clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: radius, style: .continuous).strokeBorder(.black.opacity(0.85), lineWidth: 2.5))
        .overlay(RoundedRectangle(cornerRadius: radius, style: .continuous).strokeBorder(.black.opacity(0.35), lineWidth: 7).blur(radius: 4))
        .clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
    }
}

/// The gaps between pixels: every light on the glass becomes a grid of dots.
struct DotMask: View {
    var pitch: CGFloat = 3
    var body: some View {
        Canvas { context, size in
            var path = Path()
            for x in stride(from: 0, through: size.width, by: pitch) { path.addRect(CGRect(x: x, y: 0, width: 1, height: size.height)) }
            for y in stride(from: 0, through: size.height, by: pitch) { path.addRect(CGRect(x: 0, y: y, width: size.width, height: 1)) }
            context.fill(path, with: .color(.black.opacity(0.42)))
        }.accessibilityHidden(true)
    }
}

/// A reflective green LCD in a dark surround.
struct LCD<Content: View>: View {
    var power: Double = 1
    @ViewBuilder var content: Content
    var body: some View {
        content.padding(.horizontal, 12).padding(.vertical, 8)
            .foregroundStyle(Dex.screenDark)
            .opacity(power > 0.3 ? 1 : 0)
            .background(LinearGradient(colors: [Dex.screen, Dex.screen.opacity(0.82)], startPoint: .top, endPoint: .bottom).brightness(power > 0.3 ? 0 : -0.4))
            .overlay { DotMask(pitch: 2.5).opacity(0.18).allowsHitTesting(false) }
            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 8, style: .continuous).strokeBorder(.black.opacity(0.28), lineWidth: 1))
            .padding(4)
            .background(Dex.ink.shadow(.inner(color: .black, radius: 2, y: 1)), in: RoundedRectangle(cornerRadius: 11, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 11, style: .continuous).strokeBorder(.white.opacity(0.2), lineWidth: 1).offset(y: 1))
    }
}

struct Pokeball: View {
    var body: some View {
        GeometryReader { proxy in
            let s = proxy.size.width
            ZStack {
                Circle().fill(Dex.cream)
                Rectangle().fill(LinearGradient(colors: [Dex.redLight, Dex.red], startPoint: .top, endPoint: .bottom))
                    .frame(height: s / 2).frame(maxHeight: .infinity, alignment: .top)
                Rectangle().fill(Dex.ink).frame(height: s * 0.07)
                Circle().fill(Dex.ink).frame(width: s * 0.34)
                Circle().fill(Dex.cream).frame(width: s * 0.22)
                Ellipse().fill(.white.opacity(0.7)).frame(width: s * 0.22, height: s * 0.1).rotationEffect(.degrees(-30)).offset(x: -s * 0.22, y: -s * 0.28)
            }.clipShape(Circle())
                .shadow(color: .black.opacity(0.35), radius: 6, y: 4)
        }.accessibilityLabel("Poké Ball")
    }
}
