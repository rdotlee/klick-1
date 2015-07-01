Template['users'].helpers({
  users: function () {
    return Meteor.users.find();
  },

  isRole: function(user, role){
    if(Roles.userIsInRole(user,[role])){
      return true;
    } else {
      return false;
    }
  }
});

Template['users'].events({
  "click #set-admin": function(event, template){
    Roles.addUsersToRoles(this, ['admin'])
  },
  "click #remove-admin": function(event, template){
    var index = this.roles.indexOf(5);
    this.roles.splice(index, 1);
    Roles.setUserRoles(this, this.roles);
  },
  "click #delete-user": function(event, template){
    Meteor.users.remove({_id:this._id}) ;
  },

});
