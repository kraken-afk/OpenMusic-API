import { Client } from 'pg'
import process from 'node:process'
import { config } from 'dotenv';

config();

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env;

(async () => {
  await dropDb()
})()

export async function dropDb (): Promise<void> {
  const client = new Client({
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    port: PGPORT ? parseInt(PGPORT) : undefined,
    database: 'postgres' // Connect to the default 'postgres' database
  })

  try {
    await client.connect()

    // Check if the specified database already exists
    console.log(`Checking database with name '${PGDATABASE}'...`)
    const result = await client.query(
      `
      SELECT datname FROM pg_database WHERE datname = $1;
    `,
      [PGDATABASE]
    )

    if (result.rows.length === 0) {
      console.log('Database doesn\'t exist.')
      process.exit(0)
    } else {
      console.log(`Dropping database with name '${PGDATABASE}'...`)
      await client.query(
          `
        DROP DATABASE ${PGDATABASE};
        `
      )
      console.log(`Database with name '${PGDATABASE}' removed.`)
    }
  } catch (error) {
    console.error('Error dropping database:', error)
  } finally {
    await client.end()
  }
}
