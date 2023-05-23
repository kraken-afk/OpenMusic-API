import process from "node:process";
(require('dotenv')).config();

const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;

const PrismaClientScheme = {
  datasources: {
    db: {
      url: `postgresql:\/\/${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=public`
    }
  }
}

export default PrismaClientScheme;