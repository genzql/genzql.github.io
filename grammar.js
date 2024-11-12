/**
 * @file Common functionality shared across SQL dialects.
 * @author Vinesh Kannan and Tamjid Rahman
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />

export default grammar({
  name: "base_sql",

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => seq(
      choice(
        $.select_statement,
        // $.insert_statement,
        // $.update_statement,
        // $.delete_statement,
        // $.create_table_statement
      ),
      optional(';')
    ),

    // SELECT statement and its components
    select_statement: $ => seq(
      'SELECT',
      $._select_elements,
      optional($._from_clause),
      optional($._where_clause),
      optional($._group_by_clause),
      optional($._having_clause),
      optional($._order_by_clause),
      optional($._limit_clause)
    ),

    _select_elements: $ => choice(
      '*',
      commaSep1($._select_element)
    ),

    _select_element: $ => prec(1, choice(
      $._expression,
      $.column_reference,
      $.alias
    )),

    alias: $ => seq(
      $._expression,
      'AS',
      $.identifier
    ),

    _from_clause: $ => seq(
      'FROM',
      commaSep1($._table_reference)
    ),

    _table_reference: $ => choice(
      $.table_name,
      $.join_clause
    ),

    join_clause: $ => prec.left(seq(
      $._table_reference,
      repeat1(seq(
        choice(
          'JOIN',
          seq('LEFT', optional('OUTER'), 'JOIN'),
          seq('RIGHT', optional('OUTER'), 'JOIN'),
          seq('INNER', 'JOIN'),
          seq('FULL', optional('OUTER'), 'JOIN')
        ),
        $._table_reference,
        'ON',
        $._expression
      ))
    )),

    _where_clause: $ => seq(
      'WHERE',
      $._expression
    ),

    _group_by_clause: $ => seq(
      'GROUP',
      'BY',
      commaSep1($._expression)
    ),

    _having_clause: $ => seq(
      'HAVING',
      $._expression
    ),

    _order_by_clause: $ => seq(
      'ORDER',
      'BY',
      commaSep1($.order_by_element)
    ),

    order_by_element: $ => seq(
      $._expression,
      optional(choice('ASC', 'DESC'))
    ),

    _limit_clause: $ => seq(
      'LIMIT',
      $.number
    ),

    // Basic expressions
    _expression: $ => prec(0, choice(
      $.binary_expression,
      $.unary_expression,
      $.parenthesized_expression,
      $.function_call,
      $.column_reference,
      $.literal
    )),

    binary_expression: $ => choice(
      ...[
        ['AND', 2],
        ['OR', 1],
        ['=', 3],
        ['!=', 3],
        ['<>', 3],
        ['<', 3],
        ['<=', 3],
        ['>', 3],
        ['>=', 3],
        ['+', 4],
        ['-', 4],
        ['*', 5],
        ['/', 5],
      ].map(([operator, precedence]) =>
        prec.left(precedence, seq(
          $._expression,
          operator,
          $._expression
        ))
      )
    ),

    unary_expression: $ => choice(
      prec(6, seq('NOT', $._expression)),
      prec(6, seq('-', $._expression))
    ),

    parenthesized_expression: $ => seq(
      '(',
      $._expression,
      ')'
    ),

    function_call: $ => seq(
      $.identifier,
      '(',
      optional(commaSep1($._expression)),
      ')'
    ),

    // Basic elements
    column_reference: $ => seq(
      optional(seq($.identifier, '.')),
      $.identifier
    ),

    table_name: $ => seq(
      optional(seq($.identifier, '.')),
      $.identifier
    ),

    literal: $ => choice(
      $.string,
      $.number,
      $.boolean,
      $.null
    ),

    string: $ => choice(
      seq("'", /[^']*/, "'"),
      seq('"', /[^"]*/, '"')
    ),

    number: $ => /\d+(\.\d+)?/,

    boolean: $ => choice('TRUE', 'FALSE'),

    null: $ => 'NULL',

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  }
});

// Helper functions for common patterns
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
