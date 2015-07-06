Template['eventCard'].helpers({
  isRegistered: function(){
    if(this.users && _.indexOf(this.users, Meteor.userId()) != -1){
      return true;
    } else {
      return false;
    }
  },
  eventCount: function(){
    return this.users.length || 0;
  },

  isHot: function(num){
    return num >= 5;
  },
});

Template['eventCard'].events({
  "click #register": function (event, template) {
    Events.update(this._id,{
      $addToSet: {users: Meteor.userId()}
    })
  },
  "click #unregister": function (event, template) {
    Events.update(this._id,{
      $pull: {users: Meteor.userId()}
    })
  },
});
