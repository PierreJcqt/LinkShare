'use strict'
const { Model } = require('sequelize')

const { deleteFile } = require('../services/file-removal')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Post, { foreignKey: 'userId' });
      User.hasMany(models.Likes, { foreignKey: 'userId', onDelete: 'CASCADE' });
      models.User.hasMany(models.Kudo, { as: 'SentKudos', foreignKey: 'senderId' });
    }
  }

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type : DataTypes.STRING,
        allowNull: true,
      },
      failedAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      lastFailedAttempt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )

  return User;
}

