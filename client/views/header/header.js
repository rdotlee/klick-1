Template['header'].helpers({
  profilePath: function () {
    return '/users/' + Meteor.userId();
  }
});

Template['header'].events({
});
