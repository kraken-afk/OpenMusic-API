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
      "playlistActivities",
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
      }
    );
  },

  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("playlistActivities");
  },
};
