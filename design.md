# zql

## Functional Requirements

### Core Language

#### Conversion

- Converts code on-demand
- Converts from SQL of a given dialect to zql
- Converts from zql to SQL of a given dialect
- Converts zql to DuckDB for execution
- Returns an error if conversion fails
- Stretches: Converts partial code, even if the SQL statement is not complete

#### Execution

- Executes the converted DuckDB code on demand
- Executes in a local DuckDB instance
- Returns the results of the executed query
- Returns an error if the query failed

#### Dialects

- Supports converting to and from the following SQL dialects:
  - zql
  - PostgreSQL
  - MySQL
  - DuckDB SQL
  - ClickHouse SQL
- Converts to zql using the specified source dialect, if any
- Converts to zql using the detected source dialect, if no specified source dialect
- Requires a specified target dialect when converting from zql
- Shows an error if no dialect was specified and dialect could not be detected

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
