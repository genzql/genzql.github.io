import { AsyncDuckDB, AsyncDuckDBConnection } from "@duckdb/duckdb-wasm";
import { useEffect, useState } from "react";
import { initializeDuckDB, cleanUpDuckDB } from "./duckdb";
import SQLEditor from "./SQLEditor.tsx";
import "./App.css";
import ResultTable from "./ResultTable.tsx";

function useDuckDBConnection() {
  const [db, setDb] = useState<AsyncDuckDB | null>(null);
  const [conn, setConn] = useState<AsyncDuckDBConnection | null>(null);

  useEffect(() => {
    let cleanUpFn = () => {};

    initializeDuckDB().then(async (duck) => {
      cleanUpFn = () => {
        setDb(null);
        setConn(null);
        cleanUpDuckDB(duck.conn);
      };

      setDb(duck.db);
      setConn(duck.conn);
    });

    return () => cleanUpFn?.();
  }, []);

  return { db, conn };
}

const FRIENDS = [
  "Tamjid",
  "Vinesh",
  "Samarth",
  "Andrew",
  "Evan",
  "David",
  "Joni",
  "Keegan",
  "Lauren",
  "Nancy",
  "Shoji",
  "James",
  "Laura",
];

async function insertFriends(conn: AsyncDuckDBConnection) {
  const name = FRIENDS[Math.floor(Math.random() * FRIENDS.length)];
  const score = Math.ceil(Math.random() * 100);
  await conn.query(`INSERT INTO friends VALUES ('${name}', ${score})`);
  console.log(`🦆 Inserted ('${name}', ${score}) into table [friends].`);
}

async function setUpDatabase(conn: AsyncDuckDBConnection) {
  const query = `CREATE TABLE IF NOT EXISTS friends (name VARCHAR(255) NOT NULL, score INTEGER NOT NULL)`;
  await conn.query(query);
  await insertFriends(conn);
}

function transpileToZQL(sql: string) {
  return `transpileToZQL(${sql})`;
}

function transpileFromZQL(sql: string) {
  return `transpileFromZQL(${sql})`;
}

async function runSQL(conn: AsyncDuckDBConnection, sql: string) {
  console.log(`🦆 Running SQL: ${sql}`);
  const result = await conn.query(sql);
  return result.toArray().map((row) => row.toJSON());
}

function App() {
  const { db, conn } = useDuckDBConnection();

  useEffect(() => {
    if (db == null || conn == null) {
      return;
    }

    setUpDatabase(conn);
  }, [db, conn]);

  const [inputSQL, setInputSQL] = useState<string>("");
  const [outputSQL, setOutputSQL] = useState<string>("");
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);

  const handleRunSQL = async () => {
    if (conn) {
      const result = await runSQL(conn, inputSQL);
      setSqlResult(result);
    }
  };
  return (
    <>
      <h1>zql</h1>
      <p>The future is quack.</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "48%" }}>
          <SQLEditor
            value={inputSQL}
            onChange={(v) => {
              setInputSQL(v);
              setOutputSQL(transpileToZQL(v));
            }}
          />
          <button onClick={handleRunSQL}>Run</button>
        </div>
        <div style={{ width: "48%" }}>
          <SQLEditor
            value={outputSQL}
            onChange={(v) => {
              setOutputSQL(v);
              setInputSQL(transpileFromZQL(v));
            }}
          />
        </div>
      </div>

      {sqlResult && <ResultTable result={sqlResult} />}
    </>
  );
}

export default App;
