import baseSql from "../basesql/grammar.js";

/**
 * This is a tree-sitter grammar for ANSI SQL.
 * @file Common functionality shared across SQL dialects.
 * @author Vinesh Kannan and Tamjid Rahman
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />

export default grammar(baseSql, {
  name: "postgresql",

  rules: {
    data_type: ($) =>
      choice(
        "INT",
        "INTEGER",
        "BIGINT",
        "SMALLINT",
        "VARCHAR",
        "TEXT",
        "CHAR",
        "DATE",
        "TIMESTAMP",
        "BOOLEAN", // "BOOL",
        "FLOAT",
        "DOUBLE",
        "DECIMAL",
        seq("VARCHAR", "(", $.number, ")"),
        seq("CHAR", "(", $.number, ")")
      ),
  },
});
