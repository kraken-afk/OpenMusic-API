"use strict";
const { importParse } = require("../../libs/TypeScriptParser");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize)} Sequelize
   */
  async up(queryInterface, { DataTypes }) {
    await queryInterface.createTable("songs", {
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
    });
  },

  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize)} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("songs");
  },
};
