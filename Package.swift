// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterBaseSql",
    products: [
        .library(name: "TreeSitterBaseSql", targets: ["TreeSitterBaseSql"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterBaseSql",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterBaseSqlTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterBaseSql",
            ],
            path: "bindings/swift/TreeSitterBaseSqlTests"
        )
    ],
    cLanguageStandard: .c11
)
