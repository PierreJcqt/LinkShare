'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Receive extends Model {
        static associate(models) {
            Receive.belongsTo(models.User, { as: 'Recipient', foreignKey: 'recipientId' });
            Receive.belongsTo(models.Kudo, { as: 'ReceivedKudo', foreignKey: 'kudoId' });
        }
    }
    Receive.init({
        recipientId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        kudoId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'kudos',
                key: 'id',
            },
        },
    }, {
        sequelize,
        modelName: 'Receive',
        timestamps: true,
        freezeTableName: true,
        tableName: 'Receives',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    });

    return Receive;
};
