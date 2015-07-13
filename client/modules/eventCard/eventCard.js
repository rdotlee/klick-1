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
    if(!this.groups){
      this.groups = [];
      this.groups.push([Meteor.userId()]);
    } else if (this.groups && this.groups[this.groups.length - 1].length < this.groupLimit){
      this.groups[this.groups.length - 1].push(Meteor.userId())
    } else {
      this.groups.push([Meteor.userId()]);
    }
    console.log(this.groups);

    Events.update(this._id,{
      $addToSet: {users: Meteor.userId()},
      $set: {groups: this.groups}
    })
  },
  "click #unregister": function (event, template) {
    _.each(this.groups, function(group, index, list){
      list[index] = _.filter(group, function(id){ return id !== Meteor.userId() });
    });
    Events.update(this._id,{
      $pull: {users: Meteor.userId()},
      $set: {groups: this.groups}
    })
  },
  "click #delete": function (event, template) {
    Events.remove(this._id);
  },
});
