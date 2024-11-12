import {
  AsyncDuckDB,
  AsyncDuckDBConnection,
} from '@duckdb/duckdb-wasm'
import { useEffect, useState } from 'react'
import { initializeDuckDB, cleanUpDuckDB } from './duckdb'
import './App.css'

function useDuckDBConnection() {
  const [db, setDb] = useState<AsyncDuckDB | null>(null)
  const [conn, setConn] = useState<AsyncDuckDBConnection | null>(null)

  useEffect(() => {
    let cleanUpFn = () => {}

    initializeDuckDB().then(async (duck) => {
      cleanUpFn = () => {
        setDb(null)
        setConn(null)
        cleanUpDuckDB(duck.conn)
      }

      setDb(duck.db)
      setConn(duck.conn)
    })

    return () => cleanUpFn?.()
  }, [])

  return { db, conn }
}

const FRIENDS = [
  'Tamjid',
  'Vinesh',
  'Samarth',
  'Andrew',
  'Evan',
  'David',
  'Joni',
  'Keegan',
  'Lauren',
  'Nancy',
  'Shoji',
  'James',
  'Laura',
]

async function insertFriends(conn: AsyncDuckDBConnection) {
  const name = FRIENDS[Math.floor(Math.random() * FRIENDS.length)]
  const score = Math.ceil(Math.random() * 100)
  await conn.query(`INSERT INTO friends VALUES ('${name}', ${score})`)
  console.log(`🦆 Inserted ('${name}', ${score}) into table [friends].`)
}

async function getFriends(conn: AsyncDuckDBConnection) {
  const result = await conn.query(`SELECT * FROM friends`)
  const friends = result.toArray().map((row) => row.toJSON())
  console.log({ friends })
}

async function setUpDatabase(conn: AsyncDuckDBConnection) {
  const query = `CREATE TABLE IF NOT EXISTS friends (name VARCHAR(255) NOT NULL, score INTEGER NOT NULL)`
  await conn.query(query)
  await insertFriends(conn)
}

function App() {
  const { db, conn } = useDuckDBConnection()

  useEffect(() => {
    if (db == null || conn == null) {
      return
    }

    setUpDatabase(conn)
  }, [db, conn])

  return (
    <>
      <h1>Web DuckDB</h1>
      <p>The future is quack.</p>
      <button onClick={() => conn && insertFriends(conn)}>Insert</button>
      <button onClick={() => conn && getFriends(conn)}>Query</button>
    </>
  )
}

export default App
