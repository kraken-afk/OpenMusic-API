import { DataTypes, ModelAttributes } from "sequelize";

export const CollaborationsModelAttributes: ModelAttributes = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  playlistId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "playlists",
      key: "id"
    }
  },
  userIds: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  }
};