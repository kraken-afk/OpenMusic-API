"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize)} Sequelize
   */
  async up(queryInterface, { DataTypes }) {
    await queryInterface.createTable(
      "userAlbumLikes",
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
      }
    );
  },

  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize)} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("userAlbumLikes");
  },
};
