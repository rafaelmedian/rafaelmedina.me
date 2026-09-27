// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "PocketDexCore",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "PocketDexCore", targets: ["PocketDexCore"])],
    targets: [
        .target(name: "PocketDexCore"),
        .testTarget(name: "PocketDexCoreTests", dependencies: ["PocketDexCore"])
    ]
)
