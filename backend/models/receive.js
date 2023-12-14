'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Receive extends Model {
        static associate(models) {
        // Définir les associations ici, si nécessaire
        }
    }

    Receive.init({
        id_users: {
        type: DataTypes.INTEGER,
        primaryKey: true
        },
        id_kudos: {
        type: DataTypes.INTEGER,
        primaryKey: true
        }
    }, {
        sequelize,
        modelName: 'Receive',
        timestamps: false // Pas de champs timestamps
    });

    return Receive;
};
