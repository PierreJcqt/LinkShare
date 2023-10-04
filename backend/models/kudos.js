'use strict'

const { Model } = require('sequelize')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  class Kudo extends Model {
    static associate (models) {
      Kudo.belongsTo(models.User, { as: 'Sender', foreignKey: 'senderId' })
      Kudo.belongsTo(models.User, { as: 'Recipient', foreignKey: 'recipientId' })
    }

    readableCreatedAt () {
      return moment(this.createdAt)
        .locale('fr')
        .format('LL')
    }
  }
  Kudo.init(
    {
      senderId: DataTypes.INTEGER,
      recipientId: DataTypes.INTEGER,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Kudo',
    }
  )

  return Kudo
}
