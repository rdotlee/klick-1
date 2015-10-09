Template['user'].helpers({

  userIsLoggedInUser: function(userId){
    return userId === Meteor.userId();
  },

  name: function(){
    if(this.profile.firstName){
      return this.profile.firstName + " " + this.profile.lastName;
    } else {
      return username
    }
  },

  showEdit: function(userId) {
    return userId === Meteor.userId() || Roles.userIsInRole(userId, 'admin');
  }
});

Template['user'].events({
});
