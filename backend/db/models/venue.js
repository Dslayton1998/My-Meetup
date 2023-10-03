'use strict';
const {
  Model
} = require('sequelize');
const { all } = require('../../routes/api');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }, 
    address: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    city: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }, 
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};