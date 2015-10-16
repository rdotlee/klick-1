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

  isHot: function(){
    return this.users.length >= 5;
  },

  future: function(){
    return this.date > new Date();
  },

  isFull: function(){
    return this.users.length === this.eventLimit;
  },

  canceledOn: function(){
    console.log( Meteor.user())
    return Meteor.user().canceledEvents ? Meteor.user().canceledEvents.indexOf(this._id) !== -1 : false;
  },
});

Template['eventCard'].events({
  "click #register": function (event, template) {
    Events.update(this._id,{
      $addToSet: {users: Meteor.userId()},
    })
    Router.go('event',{_id: this._id})
  },
  "click #delete": function (event, template) {
    Events.remove(this._id);
  },
});


