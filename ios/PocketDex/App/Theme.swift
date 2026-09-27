import SwiftUI

enum Dex {
    static let red = Color(red: 0.77, green: 0.19, blue: 0.24)
    static let redLight = Color(red: 0.94, green: 0.36, blue: 0.36)
    static let redDark = Color(red: 0.43, green: 0.10, blue: 0.15)
    static let ink = Color(red: 0.12, green: 0.16, blue: 0.15)
    static let cream = Color(red: 0.94, green: 0.91, blue: 0.81)
    static let screen = Color(red: 0.73, green: 0.81, blue: 0.61)
    static let screenDark = Color(red: 0.23, green: 0.33, blue: 0.24)
    static let blue = Color(red: 0.35, green: 0.69, blue: 0.79)
    static let yellow = Color(red: 0.98, green: 0.76, blue: 0.29)
    static let quick = Animation.easeOut(duration: 0.16)
    static let reveal = Animation.spring(duration: 0.36, bounce: 0.15)
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

struct ShellBackground: View {
    var body: some View {
        LinearGradient(colors: [Dex.redLight, Dex.red, Dex.redDark], startPoint: .topLeading, endPoint: .bottomTrailing)
            .overlay {
                Canvas { context, size in
                    for index in 0..<2600 {
                        let x = CGFloat((index * 73 + 17) % 997) / 997 * size.width
                        let y = CGFloat((index * 137 + 59) % 991) / 991 * size.height
                        let dot = CGRect(x: x, y: y, width: index.isMultiple(of: 3) ? 1.5 : 0.7, height: 0.7)
                        context.fill(Path(ellipseIn: dot), with: .color(index.isMultiple(of: 2) ? .white.opacity(0.1) : .black.opacity(0.12)))
                    }
                }.allowsHitTesting(false).accessibilityHidden(true)
            }
    }
}

struct Screw: View {
    var body: some View {
        Circle().fill(Dex.cream.opacity(0.8))
            .overlay(Circle().strokeBorder(Dex.ink.opacity(0.8), lineWidth: 1.5))
            .overlay(Rectangle().fill(Dex.ink.opacity(0.6)).frame(width: 6, height: 1.5).rotationEffect(.degrees(-35)))
            .frame(width: 10, height: 10).accessibilityHidden(true)
    }
}

struct Speaker: View {
    var body: some View {
        VStack(spacing: 4) {
            ForEach(0..<3) { _ in
                Capsule().fill(Dex.ink).frame(width: 38, height: 3)
                    .shadow(color: .white.opacity(0.25), radius: 0, y: 1)
            }
        }.accessibilityHidden(true)
    }
}

struct Indicator: View {
    let color: Color
    var lit = true
    var body: some View {
        Circle().fill(RadialGradient(colors: [color.opacity(lit ? 1 : 0.5), color.opacity(0.7), Dex.ink], center: .topLeading, startRadius: 1, endRadius: 17))
            .overlay(Circle().strokeBorder(Dex.ink, lineWidth: 2))
            .overlay(alignment: .topLeading) { Circle().fill(.white.opacity(0.75)).frame(width: 4, height: 4).padding(4) }
            .frame(width: 18, height: 18)
            .shadow(color: lit ? color.opacity(0.4) : .clear, radius: 5)
            .accessibilityHidden(true)
    }
}

struct Lens: View {
    var size: CGFloat = 68
    var awake = true
    var body: some View {
        ZStack {
            Circle().fill(Dex.ink).offset(y: 3)
            Circle().fill(LinearGradient(colors: [.white, Dex.cream, .gray], startPoint: .topLeading, endPoint: .bottomTrailing)).padding(2)
            Circle().fill(Dex.ink).padding(7)
            Circle().fill(RadialGradient(colors: [Color.cyan, Color(red: 0.02, green: 0.4, blue: 0.65), Color(red: 0.02, green: 0.15, blue: 0.26)], center: .topLeading, startRadius: 0, endRadius: size * 0.8)).padding(10)
            Circle().stroke(.cyan.opacity(awake ? 0.8 : 0.2), lineWidth: 2).padding(14)
            Ellipse().fill(.white.opacity(0.85)).frame(width: size * 0.31, height: size * 0.16)
                .rotationEffect(.degrees(-35)).offset(x: -size * 0.12, y: -size * 0.18)
            Circle().fill(.white.opacity(0.45)).frame(width: size * 0.09).offset(x: size * 0.2, y: size * 0.21)
        }.frame(width: size, height: size)
            .shadow(color: .black.opacity(0.25), radius: 4, x: 0, y: 4)
            .accessibilityHidden(true)
    }
}

struct HardwareButtonStyle: ButtonStyle {
    var color: Color = Dex.blue
    var selected = false
    var round = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    func makeBody(configuration: Configuration) -> some View {
        let shape = RoundedRectangle(cornerRadius: round ? 100 : 10)
        configuration.label
            .foregroundStyle(Dex.ink)
            .padding(.horizontal, 10).padding(.vertical, 10)
            .frame(minWidth: 44, minHeight: 44)
            .background {
                shape.fill(Dex.ink).offset(y: configuration.isPressed ? 1 : 5)
                shape.fill(LinearGradient(colors: [color, color.opacity(0.86)], startPoint: .top, endPoint: .bottom))
                    .overlay(shape.strokeBorder(Dex.ink, lineWidth: 2))
                    .overlay(shape.inset(by: 3).strokeBorder(.white.opacity(0.32), lineWidth: 1))
            }
            .overlay { if selected { shape.inset(by: 5).strokeBorder(Dex.ink, style: StrokeStyle(lineWidth: 1.5, dash: [3, 2])) } }
            .offset(y: configuration.isPressed ? 3 : 0)
            .animation(reduceMotion ? nil : Dex.quick, value: configuration.isPressed)
    }
}

struct LCD<Content: View>: View {
    @ViewBuilder var content: Content
    var body: some View {
        content.padding(14)
            .background(Dex.screen.gradient)
            .overlay {
                Canvas { context, size in
                    for y in stride(from: 0.0, through: size.height, by: 4) {
                        context.fill(Path(CGRect(x: 0, y: y, width: size.width, height: 1)), with: .color(Dex.screenDark.opacity(0.07)))
                    }
                }.allowsHitTesting(false).accessibilityHidden(true)
            }
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(Dex.ink, lineWidth: 3))
            .shadow(color: .black.opacity(0.25), radius: 0, y: -3)
    }
}
