Meteor.startup(function () {
});

Deps.autorun(function(){
  Meteor.subscribe('userData');
});