
// Users.attachSchema(
//     new SimpleSchema({
//     title: {
//       type: String
//     },
//     content: {
//       type: String
//     },
//     createdAt: {
//       type: Date,
//       denyUpdate: true
//     }
//   })
// );

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Meteor.users.allow({
    insert : function (userId, doc) {
      if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
        return true;
      } else {
        return false;
      }
    },
    update : function (userId, doc) {
      if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
        return true;
      } else {
        return false;
      }
    },
    remove : function () {
      if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
        return true;
      } else {
        return false;
      }
    }
  });
}
