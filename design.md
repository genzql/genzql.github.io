# zql

## Functional Requirements

### Core Language

#### Conversion

- Converts code on-demand
- Converts SQL from a specified dialect to zql
- After conversion to zql, converts zql to DuckDB
- Returns an error if conversion from zql to DuckDB fails
- Stretches: Converts partial code, even if the SQL statement is not complete

#### Execution

- Executes the converted DuckDB code on demand
- Executes in a local DuckDB instance
- Returns the results of the executed query
- Returns an error if the query failed

#### Dialects

- Converts using the dialect specified, if any
- Converts using the detected dialect, if no dialect specified
- Shows an error if no dialect was specified and dialect could not be detected

#### Dialect Support

- Supports converting from zql to DuckDB
- Supports converting from the following SQL dialects to zql:
  - PostgreSQL
  - MySQL
  - DuckDB SQL
  - ClickHouse SQL

### Surfaces

#### Shell

- Wrapper around duckdb shell

#### CLI

- “zql transpile [SQL]”
- Takes in duckdb SQL, returns string of ZQL

#### Web

- Converts from SQL to zql while the user is editing
- Executes query when user clicks a button
- Shows results of the last executed query
- Shows errors of the the last attempted query
- Shows the last edited query on page load, if any
- Shows an example query on page load, if no last edited query
- Stretches: Shows syntax errors inline in the editor
- Stretches: Allows selecting and typing on multiple lines at once
