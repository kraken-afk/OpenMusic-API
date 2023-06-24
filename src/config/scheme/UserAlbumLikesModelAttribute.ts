import { DataTypes, ModelAttributes } from "sequelize";

export const UserAlbumLikesModelAttribute: ModelAttributes = {
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
};
