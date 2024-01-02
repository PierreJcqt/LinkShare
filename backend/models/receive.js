'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Receive extends Model {
        static associate(models) {
        }
    }
    Receive.init({
        userId: {
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
        timestamps: false 
    });
    return Receive;
};
