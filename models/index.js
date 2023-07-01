const User = require('./User');
const Side = require('./Side');
const Relationship = require('./Relationship');

// snooki linked mum
User.belongsToMany(User, {
    through: {
        model: Relationship,
        unique: false,
    },
    as: 'linked',
});

// mum linked by snooki
User.belongsToMany(User, {
    through: {
        model: Relationship,
        unique: false,
    },
    as: 'linked_by',
});

// snooki-mum relationship to snooki
Relationship.belongsTo(User, {
    foreign_id: 'user_id',
    // TODO: find a way to identify this rel
    
  })
  // snooki-mum rel to mum
  Relationship.belongsTo(User, {
    foreign_id: 'who_related_to',
  })

  Relationship.belongsTo(User, {
    foreign_id: 'source_id',
  })
  
  module.exports = {
      User, Side, Relationship
  }


// landed on fam tree page
// objective is to get you(0), parents (gen -1) and grandparents(-2)

// MVP assumption : 1 person construct all the family tree
// 2. no need to send out email when added a new user
// 3. diagram will always start from current user, and no further than grandparent


// https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#logical-combinations-with-operators
// {
//     [Op.or]: [
//       {
//         title: {
//           [Op.like]: 'Boat%'
//         }
//       },
//       {
//         description: {
//           [Op.like]: '%boat%'
//         }
//       }
//     ]
//   }
//   // title LIKE 'Boat%' OR description LIKE '%boat%'



// Relationship.findAll({
//     where: {
//         [Op.or]: [
//             {
//                 user_id: req.session.currentUser.id,  // people who added snooki
//             },
//             {
//                 who_related_to: req.session.currentUser.id, // people who snooki adds
//             }
//         ]
        
//     },
//     include: [
//         {model: User}
//     ]

// })



// // getting snooki



// Relationship.where({
//     user_id: snooki.id,
  
//     orWhereRelatedTo: snooki.id
  
//     whereGeneration: [-1, 1],
  
//     include: [
//       {model: 'linked'},
//       {model: 'src'},
//     ]
//   })
  
//   // 
  
//   Relationship.belongsTo(User)
//   Relationship.hasMany(User)
  
//   snooki.linked  ==> mum
  
//   mum.src ===> snooki
  
//   // snooki -> mum
//   User.belongsToMany(User, {
//     through: {
//       model: Relationship,
//       as: 'linked'
//     }
//   })
  
//   // mum -> snooki
//   User.belongsToMany(User, {
//     through: {
//       model: Relationship,
//       as: 'src'
//     }
//   })

// // Creating the relationships between data

// // M/M user to relationship

