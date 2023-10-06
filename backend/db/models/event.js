'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
      })
      
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
      
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
      })

    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER
    }, 
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 5
      }
    }, 
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }, 
    type: {
      type: DataTypes.ENUM,
      values: ['Online', 'In Person'],
      allowNull: false
    }, 
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0
      }
    }, 
    startDate: {
      type: DataTypes.DATE,
      allowNull: false //! Maybe something else?
    }, 
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};