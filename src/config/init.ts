import { config } from "dotenv";
import { Model, Sequelize } from "sequelize";
import { AlbumsModel, SongsModel } from "./config";

config();

const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;
const sequelize = new Sequelize({
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: PGPORT ? +PGPORT : 0,
  dialect: "postgres",
  logging: false
});

export class AlbumsScheme extends Model {
  declare id: string;
  declare name: string;
  declare year: number;
}

export class SongsScheme extends Model {
  declare id: string;
  declare title: string;
  declare performer: string;
  declare genre: string;
  declare year: string;
  declare duration?: number | null;
  declare albumId?: string | null;
}

AlbumsScheme.init(AlbumsModel, {
  sequelize,
  modelName: "albums",
  timestamps: false,
});

SongsScheme.init(SongsModel, {
  sequelize,
  modelName: "songs",
  timestamps: false,
});

export async function databaseSync(): Promise<void> {
  await sequelize.sync();
  console.log("Database synced");
}

export const Albums = AlbumsScheme;
export const Songs = SongsScheme;
