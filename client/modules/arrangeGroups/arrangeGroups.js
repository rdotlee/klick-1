var sortTables = [];
var new_groups = [];

Template['arrangeGroups'].helpers({
  userGroups: function() {
      var users = Meteor.users.find({_id: {$in: this.users}}).fetch();
      var userSets = [];
      _.each(this.groups,function(group, iG, groups){
        var table = {id: iG+1, people:[]};
        _.each(group,function(user, iU, group){
          var userId = _.where(users, {_id: user})[0];
          var user = Meteor.users.findOne(userId);
          table.people.push(user);
        });
        userSets.push(table)
      });
      return userSets;
  },
});

Template['arrangeGroups'].events({
  'click #auto-group': function(event, template){
    Events.update(this._id, {$set: {manualSort: false}});
    toggleGroupMode();
  },
  'click #manual-group': function(event, template){
    Events.update(this._id, {$set: {manualSort: true}});
    toggleGroupMode();
  },
  'click #save-group': function(event, template){
    if(_.every(new_groups, function(group){return group.length <= this.groupLimit}, this)){
      Events.update(this._id, {$set: {groups: new_groups}});
    } else {
      alert('Groups must be smaller than '+ this.groupLimit)
    }
    
  }
});

Template['arrangeGroups'].onRendered(function(){
  var manualSort = !!this.data.manualSort;
  new_groups = this.data.groups;
  var tables = document.getElementsByClassName('sortable-table');
  Array.prototype.forEach.call(tables, function (table){
    var sortTable = Sortable.create(table,{
      group: {name: 'tables', put:true, pull:true},
      sort: false,
      disabled: !manualSort,
      handle: '.people',
      onAdd: function (event) { 
        var userId = event.item.dataset.userId;
        var fromTable = event.from.dataset.tableId;
        var toTable = event.to.dataset.tableId;
        var i = new_groups[fromTable-1].indexOf(userId)
        new_groups[fromTable-1].splice(i,1);
        new_groups[toTable-1].push(userId);
      },
    });
    sortTables.push(sortTable);
  })
});

function toggleGroupMode(s){
  _.each(sortTables,function(sortTable){
    var state = s || sortTable.option("disabled"); 
    sortTable.option("disabled", !state);
  });
}