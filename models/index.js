const User = require('./User');
const Side = require('./Side');
const Relationship = require('./Relationship');

// Creating the relationships between data

// source  -- snooki forward to mum
User.belongsToMany(Relationship, {
  foreignKey: "user_id",
  onDelete: "NO ACTION",
  as: 'related'
});

// related -- mum back to snooki
User.belongsToMany(Relationship, {
  foreignKey: "who_related_id",
  onDelete: "NO ACTION",
  as: 'inverse_related'
});

Relationship.belongsTo(Side, {
  foreignKey: "side_id",
  onDelete: "NO ACTION"
});

Relationship.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "NO ACTION"
});

Relationship.belongsTo(User, {
  foreignKey: "who_related_id",
  onDelete: "NO ACTION"
});

module.exports = {
    User, Side, 
    // Relationship
}