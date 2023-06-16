// @ts-check

(require('dotenv')).config();

const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env

/**
 * @type {(import('sequelize').Options)}
 */
module.exports = {
    username: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    host: PGHOST,
    port: parseInt(PGPORT ? PGPORT : "3000"),
    dialect: 'postgres'
}
