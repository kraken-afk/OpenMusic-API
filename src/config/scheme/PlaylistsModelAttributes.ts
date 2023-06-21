import { DataTypes, type ModelAttributes } from "sequelize";

export const PlaylistsModelAttributes: ModelAttributes = {
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
};
