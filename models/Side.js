const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/connection');

class Side extends Model {}

Side.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: false,
    underscored: true,
    modelName: 'side',
  }
);

module.exports = Side;


// Side can be mother father spouse or sibling
// make sure we validate that on the client side. --- Checkbox with four choices