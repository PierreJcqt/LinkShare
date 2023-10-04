'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Notifications.belongsTo(models.User, {
        foreignKey: 'recipientUserId',
        as: 'Receptionist'
      })
      Notifications.belongsTo(models.User, {
        foreignKey: 'senderUserId',
        as: 'Sender'
      })
    }
  }
  Notifications.init(
    {
      recipientUserId: DataTypes.INTEGER,
      senderUserId: DataTypes.INTEGER,
      postId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      viewed: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Notifications'
    }
  )
  return Notifications
}