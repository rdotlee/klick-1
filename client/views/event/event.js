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
    var classes = "col-centered col-xs-6 ";
    if(context.eventData.groupLimit > 8){
      return {class: classes + "col-md-2"};
    } else {
      return {class: classes + "col-md-3"};
    }
  },
  group: function(){
    var group = [];
    for (var i = this.eventData.groups.length - 1; i >= 0; i--) {
      var usersIndex = this.eventData.groups[i].indexOf(Meteor.userId());
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
    if(!this.groups){
      this.eventData.groups = [];
      this.eventData.groups.push([Meteor.userId()]);
    } else if (this.eventData.groups && this.eventData.groups[this.groups.length - 1].length < this.eventData.groupLimit){
      this.eventData.groups[this.eventData.groups.length - 1].push(Meteor.userId())
    } else {
      this.eventData.groups.push([Meteor.userId()]);
    }
    console.log(this.eventData.groups);

    Events.update(this.eventData._id,{
      $addToSet: {users: Meteor.userId()},
      $set: {groups: this.eventData.groups}
    })
  },
  "click #unregister": function (event, template) {
    _.each(this.eventData.groups, function(group, index, list){
      list[index] = _.filter(group, function(id){ return id !== Meteor.userId() });
    });
    Events.update(this.eventData._id,{
      $pull: {users: Meteor.userId()},
      $set: {groups: this.eventData.groups}
    })
  },
});

Template['event'].onRendered(function(){
  var now = moment();
  var releaseDate = moment(this.data.eventData.date).subtract(this.data.config.release_frame, 'days');
  var diff = releaseDate.diff(now, 'seconds');

  countdown.add(diff);
})
