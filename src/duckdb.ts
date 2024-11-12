import * as duckdb from '@duckdb/duckdb-wasm'
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

const MANUAL_BUNDLES = {
    mvp: {
        mainModule: duckdb_wasm,
        mainWorker: mvp_worker,
    },
    eh: {
        mainModule: duckdb_wasm_eh,
        mainWorker: eh_worker,
    },
}

export async function initializeDuckDB() {
    console.log('🦆 Initializing DuckDB...')
    // Select a bundle based on browser checks
    const bundle = await duckdb.selectBundle(MANUAL_BUNDLES)

    // Create a new worker with the selected bundle
    if (bundle.mainWorker == null) {
        throw new Error('Failed to initialize worker from DuckDB bundle.')
    }
    const worker = new Worker(bundle.mainWorker)
    const logger = new duckdb.ConsoleLogger(0)
    const db = new duckdb.AsyncDuckDB(logger, worker)

    // Instantiate the asynchronous DuckDB instance
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker)

    // Create a new connection to run queries
    const conn = await db.connect()

    return { db, conn }
}

export async function cleanUpDuckDB(conn: duckdb.AsyncDuckDBConnection) {
    // Cleanup
    await conn.close()
}
