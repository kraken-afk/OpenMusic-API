import { DataTypes, type ModelAttributes } from "sequelize";

export const AuthenticationModelAttributes: ModelAttributes = {
  token: {
    type: DataTypes.TEXT,
    allowNull: true,
    primaryKey: true,
  },
};
