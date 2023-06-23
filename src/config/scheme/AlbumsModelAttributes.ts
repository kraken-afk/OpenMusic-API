import { DataTypes, type ModelAttributes } from "sequelize";

export const AlbumsModelAttributes: ModelAttributes = {
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
};
