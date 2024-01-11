'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Users', {
      type: 'unique',
      fields: ['email'],
      name: 'unique_email_constraint_1' // Nom modifié pour éviter les conflits
    })
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Users', 'unique_email_constraint_1')
  }
}
