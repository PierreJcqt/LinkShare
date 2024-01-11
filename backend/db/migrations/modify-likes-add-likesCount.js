'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Posts');
    if (!tableDescription.likesCount) {
      await queryInterface.addColumn('Posts', 'likesCount', {
        type: Sequelize.INTEGER
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'likesCount');
  }
}