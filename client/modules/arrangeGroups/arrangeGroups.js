Template['arrangeGroups'].helpers({
  userGroups: function() {
    if(this.users){
      var users = Meteor.users.find({_id: {$in: this.users}}).fetch();
      var userGroups = [];
      _.each(this.groups,function(group, iG, groups){
        var table = [];
        _.each(group,function(user, iU, group){
          table.push(_.where(users, {_id: user})[0])
        });
        userGroups.push(table)
      });
      return userGroups;
    }
    return null
  },
  list1: [1,2,3]
});

Template['arrangeGroups'].events({
});


