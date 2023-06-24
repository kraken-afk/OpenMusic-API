"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize)} Sequelize
   */
  async up(queryInterface, { DataTypes }) {
    await queryInterface.addColumn("albums", "likeCount", {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    });
  },

  /**
   *
   * @param {(import('sequelize').QueryInterface))} queryInterface
   * @param {(import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("albums", "likeCount");
  },
};
