import { AlbumsModelAttributes } from "./scheme/AlbumsModelAttributes";
import { AuthenticationModelAttributes } from "./scheme/AuthenticationModelAttributes";
import { CollaborationsModelAttributes } from "./scheme/CollaborationsModelAttributes";
import { PlaylistActivitiesModelAttributes } from "./scheme/PlaylistActivitiesModelAttributes";
import { PlaylistsModelAttributes } from "./scheme/PlaylistsModelAttributes";
import { SongsModelAttributes } from "./scheme/SongsModelAttributes";
import { UsersModelAttributes } from "./scheme/UsersModelAttributes";
import { Model, Sequelize } from "sequelize";

const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST, PGPORT } = process.env;
const sequelize = new Sequelize({
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: PGPORT ? +PGPORT : 0,
  dialect: "postgres",
  logging: false,
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

export class UsersScheme extends Model {
  declare id: string;
  declare username: string;
  declare fullname: string;
  declare password: string;
}

export class AuthenticationsScheme extends Model {
  declare token: string;
}

export class PlaylistsScheme extends Model {
  declare id: string;
  declare name: string;
  declare owner: string;
  declare songs: string[];
}

export class CollaborationsScheme extends Model {
  declare id: string;
  declare playlistId: string;
  declare userIds: string[];
}

export class PlaylistActivitiesScheme extends Model {
  declare id: string;
  declare playlistId: string;
  declare songId: string;
  declare userId: string;
  declare time?: string;
  declare action: "add" | "delete";
}

AlbumsScheme.init(AlbumsModelAttributes, {
  sequelize,
  modelName: "albums",
  timestamps: false,
});

SongsScheme.init(SongsModelAttributes, {
  sequelize,
  modelName: "songs",
  timestamps: false,
});

UsersScheme.init(UsersModelAttributes, {
  sequelize,
  modelName: "users",
  timestamps: false,
});

AuthenticationsScheme.init(AuthenticationModelAttributes, {
  sequelize,
  modelName: "authentications",
  timestamps: false,
});

PlaylistsScheme.init(PlaylistsModelAttributes, {
  sequelize,
  modelName: "playlists",
  timestamps: false,
});

CollaborationsScheme.init(CollaborationsModelAttributes, {
  sequelize,
  modelName: "collaborations",
  timestamps: false,
});

PlaylistActivitiesScheme.init(PlaylistActivitiesModelAttributes, {
  sequelize,
  modelName: "playlistActivities",
  timestamps: false,
});

export async function databaseSync(): Promise<void> {
  await sequelize.sync();
  console.log("Database synced");
}

export const Albums = AlbumsScheme;
export const Songs = SongsScheme;
export const Users = UsersScheme;
export const Auth = AuthenticationsScheme;
export const Playlists = PlaylistsScheme;
export const collaborations = CollaborationsScheme;
export const Activities = PlaylistActivitiesScheme;
