'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Receives', {
        recipientId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
            model: 'Users',
            key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        kudoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
            model: 'Kudos',
            key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Receives');
    },
};
