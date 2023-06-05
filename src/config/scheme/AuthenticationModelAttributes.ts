import { DataTypes, ModelAttributes } from "sequelize";

export const AuthenticationModelAttributes: ModelAttributes = {
  token: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}
