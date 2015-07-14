Meteor.publish('Events', function () {
  return Events.find();
});

Meteor.publish('Event', function (id) {
  return Events.find({_id: id});
});
