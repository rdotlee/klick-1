var countdown = new ReactiveCountdown(0);
countdown.start();

Template['event'].helpers({
  viewable: function () {
    return moment().add(this.config.release_frame, 'days').isAfter(this.eventData.date);
  },
  getCountdown: function() {
    return countdown.get();
  },
  future: function(){
    return this.eventData.date > new Date();
  },
  isRegistered: function(){
    if(this.eventData.users && _.indexOf(this.eventData.users, Meteor.userId()) != -1){
      return true;
    } else {
      return false;
    }
  },
  groupAttr: function (context) {
    var classes = "col-centered ";
    if(context.eventData.groupLimit > 8){
      return {class: classes + "col-md-2"};
    } else {
      return {class: classes + "col-md-3"};
    }
  },
  group: function(){
    var group = [];
    var groups = Events.findOne({_id: this.eventData._id}).groups;
    for (var i = groups.length - 1; i >= 0; i--) {
      var usersIndex = groups[i].indexOf(Meteor.userId());
      if(usersIndex !== -1){
        group = this.eventData.groups[i];
        group.splice(usersIndex,1);
        break;
      }
    };
    return Meteor.users.find({_id: {$in: group}});
  }
  
});

Template['event'].events({
  "click #register": function (event, template) {
    Events.update(this.eventData._id,{
      $addToSet: {users: Meteor.userId()},
    })
  },
  "click #unregister": function (event, template) {
    Events.update(this.eventData._id,{
      $pull: {users: Meteor.userId()},
    })
  },
});

Template['event'].onRendered(function(){
  var now = moment();
  var releaseDate = moment(this.data.eventData.date).subtract(this.data.config.release_frame, 'days');
  var diff = releaseDate.diff(now, 'seconds');

  countdown.add(diff);
})
