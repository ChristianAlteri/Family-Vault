const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

class Relationship extends Model {}

Relationship.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    related_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },  
    generation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    side: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'relationship',
  }
);

module.exports = Relationship;
