const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');
const User = require('./User');
const Side = require('./Side');

class Relationship extends Model {}

Relationship.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
    related_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id"
      }
    },  
    generation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    side_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Side,
        key: "id"
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: false,
    underscored: true,
    modelName: 'relationship',
  }
);

module.exports = Relationship;
