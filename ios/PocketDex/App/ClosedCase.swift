import SwiftUI

struct ClosedCase: View {
    let store: GameStore
    var body: some View {
        GeometryReader { geometry in
            ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                HStack(alignment: .top, spacing: 16) {
                    Lens(size: 88, awake: false)
                    HStack(spacing: 9) {
                        Indicator(color: .red, lit: false)
                        Indicator(color: Dex.yellow, lit: false)
                        Indicator(color: .green, lit: true)
                    }.padding(.top, 12)
                    Spacer()
                    Screw().padding(.top, 8)
                }.padding(.horizontal, 30).padding(.top, 22)
                ZStack(alignment: .leading) {
                    CoverSeam().fill(Dex.redDark.opacity(0.2))
                    CoverSeam().stroke(Dex.ink, style: StrokeStyle(lineWidth: 3, lineJoin: .round))
                    CoverSeam().stroke(.white.opacity(0.16), lineWidth: 1).offset(y: 4)
                    VStack(alignment: .leading, spacing: 20) {
                        Stencil(text: "KANTO REGION / FIELD EQUIPMENT", size: 10)
                        VStack(alignment: .leading, spacing: -9) {
                            Text("POKÉ").font(.system(size: min(geometry.size.width * 0.19, 90), weight: .black, design: .rounded))
                            Text("DEX").font(.system(size: min(geometry.size.width * 0.19, 90), weight: .black, design: .rounded))
                        }
                        .tracking(-3).foregroundStyle(Dex.cream)
                        .shadow(color: Dex.redDark, radius: 0, x: 2, y: 3)
                        Text("A little world.\nWaiting to be found.")
                            .font(.system(.title3, design: .rounded, weight: .medium))
                            .foregroundStyle(Dex.cream.opacity(0.9)).lineSpacing(3)
                        Spacer(minLength: 16)
                        HStack(spacing: 14) {
                            Image(systemName: "arrowtriangle.right.fill").font(.system(size: 26))
                                .foregroundStyle(Dex.yellow).shadow(color: Dex.ink, radius: 0, x: 2, y: 2)
                            VStack(alignment: .leading, spacing: 6) {
                                Stencil(text: store.fold.supportsManualOpening ? "OPEN YOUR POKÉDEX" : "UNFOLD TO DISCOVER", size: 12)
                                Stencil(text: "\(String(format: "%02d", store.game.captured.count)) / 12 DISCOVERED", size: 10, color: Dex.cream.opacity(0.75))
                            }
                        }
                        if store.fold.supportsManualOpening {
                            Button { store.setManualOpen(true) } label: {
                                HStack { Text("Open case"); Spacer(); Image(systemName: "arrow.up.right") }
                                    .font(.system(.headline, design: .rounded))
                            }
                            .buttonStyle(HardwareButtonStyle(color: Dex.yellow))
                            .accessibilityIdentifier("open-case")
                        }
                    }.padding(.leading, 28).padding(.trailing, 42).padding(.top, 66).padding(.bottom, 32)
                }.frame(minHeight: max(470, geometry.size.height - 212))
                    .padding(.top, 12).padding(.leading, 18).padding(.trailing, 28)
                HStack {
                    Stencil(text: "POCKETDEX  /  MODEL 001", size: 9)
                    Spacer()
                    Speaker()
                    Screw().padding(.leading, 12)
                }.padding(28)
            }.frame(minHeight: geometry.size.height)
            .overlay(alignment: .trailing) {
                HingeSpine().frame(width: 18).padding(.top, 82).padding(.bottom, 16).padding(.trailing, 5)
            }
            }.scrollIndicators(.hidden)
        }
        .accessibilityElement(children: .contain)
    }
}

private struct CoverSeam: Shape {
    func path(in rect: CGRect) -> Path {
        Path { path in
            path.move(to: CGPoint(x: 0, y: 40))
            path.addLine(to: CGPoint(x: rect.width * 0.42, y: 40))
            path.addLine(to: CGPoint(x: rect.width * 0.6, y: 0))
            path.addLine(to: CGPoint(x: rect.width, y: 0))
            path.addLine(to: CGPoint(x: rect.width, y: rect.height - 14))
            path.addQuadCurve(to: CGPoint(x: rect.width - 14, y: rect.height), control: CGPoint(x: rect.width, y: rect.height))
            path.addLine(to: CGPoint(x: 14, y: rect.height))
            path.addQuadCurve(to: CGPoint(x: 0, y: rect.height - 14), control: CGPoint(x: 0, y: rect.height))
            path.closeSubpath()
        }
    }
}

struct HingeSpine: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 7)
            .fill(LinearGradient(colors: [Dex.redDark, Dex.redLight, Dex.red, Dex.redDark], startPoint: .leading, endPoint: .trailing))
            .overlay(RoundedRectangle(cornerRadius: 7).strokeBorder(Dex.ink, lineWidth: 2))
            .overlay {
                VStack { band; Spacer(); band; Spacer(); band }.padding(.vertical, 25)
            }.accessibilityHidden(true)
    }
    private var band: some View { Rectangle().fill(Dex.ink).frame(height: 3).shadow(color: .white.opacity(0.25), radius: 0, y: 3) }
}
