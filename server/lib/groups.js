Groups = {};

Groups.addToGroup = function(groups, user, groupLimit) {
  console.log('Adding user: ' + user);
  if(!groups){
    groups = [];
    groups.push([user]);
  } else if (groups && groups[groups.length - 1].length <= groupLimit){
    groups[groups.length - 1].push(user);
  } else {
    groups.push([user]);
  }
  return groups;
}

Groups.removeFromGroup = function(groups, user, groupLimit) {
  console.log('Removing user: ' + user);
  for (var i = groups.length - 1; i >= 0; i--) {
    groups[i] = _.filter(groups[i], function(id){ return id !== user});
  };
  return groups;
}