(require('dotenv')).config();

const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;
const PrismaScheme = {
  datasources: {
    db: {
      url: `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=public`
    }
  }
}

export default PrismaScheme;