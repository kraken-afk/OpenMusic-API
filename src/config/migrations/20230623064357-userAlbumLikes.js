"use strict";
const { importParse } = require("../../libs/TypeScriptParser");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize)} Sequelize
   */
  async up(queryInterface, Sequelize) {
    const scheme = await importParse("src/config/scheme/UserAlbumLikesModelAttribute.ts");
    await queryInterface.createTable(
      "userAlbumLikes",
      scheme.UserAlbumLikesModelAttribute,
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
