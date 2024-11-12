import XCTest
import SwiftTreeSitter
import TreeSitterBaseSql

final class TreeSitterBaseSqlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_base_sql())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading BaseSql grammar")
    }
}
