import { DataTypes, type ModelAttributes } from "sequelize";

export const PlaylistActivitiesModelAttributes: ModelAttributes = {
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
};
