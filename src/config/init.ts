import { DataTypes, Model, Sequelize } from "sequelize";

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
  declare coverUrl: string | null;
  declare likeCount: number | null;
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

export class UserAlbumLikesScheme extends Model {
  declare albumId: string;
  declare usersId: string[];
}

AlbumsScheme.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coverUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "albums",
    timestamps: false,
  },
);

SongsScheme.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    albumId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: "albums",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "songs",
    timestamps: false,
  },
);

UsersScheme.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "users",
    timestamps: false,
  },
);

AuthenticationsScheme.init(
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "authentications",
    timestamps: false,
  },
);

PlaylistsScheme.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    songs: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "playlists",
    timestamps: false,
  },
);

CollaborationsScheme.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    playlistId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "playlists",
        key: "id",
      },
    },
    userIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "collaborations",
    timestamps: false,
  },
);

PlaylistActivitiesScheme.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    playlistId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "playlists",
        key: "id",
      },
    },
    songId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "songs",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM("add", "delete"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "playlistActivities",
    timestamps: false,
  },
);

UserAlbumLikesScheme.init(
  {
    albumId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      references: {
        key: "id",
        model: "albums",
      },
    },
    usersId: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "userAlbumLikes",
    timestamps: false,
  },
);

AuthenticationsScheme.removeAttribute("id");

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
export const UserAlbumLikes = UserAlbumLikesScheme;
