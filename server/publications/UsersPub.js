Meteor.publish('Users', function () {
  return Meteor.users.find();
});

Meteor.publish('User', function (id) {
  return Meteor.users.find({_id: id});
});
