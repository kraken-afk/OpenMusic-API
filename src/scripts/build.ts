import { exec, type ExecException } from 'node:child_process'
import { Client } from 'pg'
import { config } from 'dotenv'
import process from 'node:process'

config()

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = process.env
;(async () => {
  await createDatabaseIfNotExists()
  await runMigrations()
  compileTypeScript()
})()

function runMigrations() {
  return new Promise((resolve, reject) => {
    console.log('Running migrations...')

    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running migrations: ${error.message}`)
        reject(error.message)
      }

      if (stderr) {
        console.error(`Migration stderr: ${stderr}`)
        reject(stderr)
      }

      console.log(stdout)
      console.log('Migrations completed successfully')
      resolve(undefined)
    })
  })
}

function compileTypeScript(): void {
  console.log('Compiling TypeScript...')
  exec(
    'npx tsc src/app.ts --outDir ./dist --esModuleInterop --target es6 --moduleResolution node --module nodenext --experimentalDecorators --skipLibCheck',
    (error: ExecException | null, stdout: string, stderr: string) => {
      if (error != null) {
        console.error('Error: ', error)
        process.exit(1)
      }
      if (stderr) {
        console.error(`Command execution failed with error: ${stderr}`)
        process.exit(1)
      }
      console.info('TypeScript Compiled')
      console.info(`${stdout}`)
      process.exit(0)
    }
  )
}

async function createDatabaseIfNotExists(): Promise<void> {
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
      // Create the database if it doesn't exist
      console.log(`Database doesn't exist, creating database with name ${PGDATABASE}...`)
      await client.query(`CREATE DATABASE ${PGDATABASE};`)
      console.log(`Database '${PGDATABASE}' created successfully.`)
    } else console.log(`Database '${PGDATABASE}' already exists.`)
  } catch (error) {
    console.error('Error creating database:', error)
  } finally {
    await client.end()
  }
}
