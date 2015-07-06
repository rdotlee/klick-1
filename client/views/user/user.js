Template['user'].helpers({

  userIsLoggedInUser: function(userId){
    return userId === Meteor.userId();
  }

});

Template['user'].events({
});
