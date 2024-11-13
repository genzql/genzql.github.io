/**
 * This is a tree-sitter grammar for ANSI SQL.
 * @file Common functionality shared across SQL dialects.
 * @author Vinesh Kannan and Tamjid Rahman
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />

export default grammar({
  name: "basesql",

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      seq(
        choice(
          $.select_statement,
          $.insert_statement,
          $.update_statement,
          $.delete_statement,
          $.create_table_statement
        ),
        optional(";")
      ),

    // SELECT statement and its components
    select_statement: ($) =>
      seq(
        "SELECT",
        $._select_elements,
        optional($._from_clause),
        optional($._where_clause),
        optional($._group_by_clause),
        optional($._having_clause),
        optional($._order_by_clause),
        optional($._limit_clause)
      ),

    _select_elements: ($) => choice("*", commaSep1($._select_element)),

    _select_element: ($) => seq($._expression, optional($.alias_suffix)),

    alias_suffix: ($) =>
      choice(
        // WITH 'AS' keyword
        seq($.alias_token, $.identifier),
        // WITHOUT 'AS' keyword
        $.identifier
      ),

    alias_token: ($) => token("AS"),

    _from_clause: ($) => seq("FROM", commaSep1($._table_reference)),

    _table_reference: ($) => choice($.table_alias, $.join_clause),

    table_alias: ($) => seq($.table_name, optional($.alias_suffix)),

    join_clause: ($) => prec.left(2, seq($._table_reference, $.join_list)),

    join_table: ($) =>
      prec.left(
        seq(
          choice(
            "JOIN",
            seq("LEFT", optional("OUTER"), "JOIN"),
            seq("RIGHT", optional("OUTER"), "JOIN"),
            seq("INNER", "JOIN"),
            seq("FULL", optional("OUTER"), "JOIN")
          ),
          $._table_reference,
          "ON",
          $._expression
        )
      ),

    join_list: ($) =>
      prec.left(1, seq($.join_table, optional(seq(",", $.join_table)))),

    _where_clause: ($) => seq("WHERE", $._expression),

    _group_by_clause: ($) => seq("GROUP", "BY", commaSep1($._expression)),

    _having_clause: ($) => seq("HAVING", $._expression),

    _order_by_clause: ($) => seq("ORDER", "BY", commaSep1($.order_by_element)),

    order_by_element: ($) =>
      seq($._expression, optional(choice("ASC", "DESC"))),

    _limit_clause: ($) => seq("LIMIT", $.number),

    // INSERT statement
    insert_statement: ($) =>
      seq(
        "INSERT",
        "INTO",
        $.table_name,
        seq(
          optional(seq("(", commaSep1($.identifier), ")")),
          choice(
            // VALUES syntax
            seq("VALUES", commaSep1(seq("(", commaSep1($._expression), ")"))),
            // SELECT syntax
            seq(
              optional(seq("(", commaSep1($.identifier), ")")),
              $.select_statement
            )
          )
        )
      ),

    // UPDATE statement
    update_statement: ($) =>
      seq(
        "UPDATE",
        $.table_name,
        "SET",
        commaSep1($.update_assignment),
        optional($._where_clause)
      ),

    update_assignment: ($) => seq($.identifier, "=", $._expression),

    // DELETE statement
    delete_statement: ($) =>
      seq("DELETE", "FROM", $.table_name, optional($._where_clause)),

    // CREATE TABLE statement
    create_table_statement: ($) =>
      seq(
        "CREATE",
        "TABLE",
        $.table_name,
        "(",
        commaSep1($.column_definition),
        ")"
      ),

    column_definition: ($) =>
      seq($.identifier, $.data_type, repeat($.column_constraint)),

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
        "BOOLEAN",
        "FLOAT",
        "DOUBLE",
        "DECIMAL",
        seq("VARCHAR", "(", $.number, ")"),
        seq("CHAR", "(", $.number, ")")
      ),

    column_constraint: ($) =>
      choice(
        "PRIMARY KEY",
        "NOT NULL",
        "UNIQUE",
        seq("DEFAULT", $._expression),
        seq("REFERENCES", $.table_name, optional(seq("(", $.identifier, ")")))
      ),

    // Basic expressions
    _expression: ($) =>
      prec(
        0,
        choice(
          $.binary_expression,
          $.unary_expression,
          $.parenthesized_expression,
          $.function_call,
          $.column_reference,
          $.literal
        )
      ),

    binary_expression: ($) =>
      choice(
        ...[
          ["OR", 1],
          ["AND", 2],
          ["=", 3],
          ["!=", 3],
          ["<>", 3],
          ["<", 3],
          ["<=", 3],
          [">", 3],
          [">=", 3],
          ["LIKE", 3],
          ["+", 4],
          ["-", 4],
          ["*", 5],
          ["/", 5],
        ].map(([operator, precedence]) =>
          prec.left(precedence, seq($._expression, operator, $._expression))
        ),
        prec.left(3, seq($._expression, "IS", "NULL")),
        prec.left(3, seq($._expression, "IS", "NOT", "NULL"))
      ),

    unary_expression: ($) =>
      choice(
        prec(6, seq("NOT", $._expression)),
        prec(6, seq("-", $._expression))
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    function_call: ($) =>
      seq(
        $.identifier,
        "(",
        choice("*", optional(commaSep1($._expression))),
        ")"
      ),

    // Basic elements
    column_reference: ($) =>
      seq(optional(seq($.identifier, ".")), $.identifier),

    table_name: ($) => seq(optional(seq($.identifier, ".")), $.identifier),

    literal: ($) => choice($.string, $.number, $.boolean, $.null),

    string: ($) => choice(seq("'", /[^']*/, "'"), seq('"', /[^"]*/, '"')),

    number: ($) => /\d+(\.\d+)?/,

    boolean: ($) => choice("TRUE", "FALSE"),

    null: ($) => "NULL",

    identifier: ($) => token(/[a-zA-Z_][a-zA-Z0-9_]*/),
  },
});

// Helper functions for common patterns
function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}