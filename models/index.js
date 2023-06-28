const User = require('./User');
const Side = require('./Side');
const Relationship = require('./Side');


// Creating the relationships between data

// M/M user to relationship
User.belongsToMany(re)

Side.belongsTo(Relationship) {
    foreignKey: 'post_id',
    onDelete: 'CASCADE',
  };
// COMPLETE

module.exports = {
    User, Side, Relationship
}