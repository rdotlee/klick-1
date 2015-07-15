Meteor.publish('Events', function () {
  return Events.find({date: {$gte: new Date()}},{sort: {date: -1}});
});

Meteor.publish('Event', function (id) {
  return Events.find({_id: id});
});
