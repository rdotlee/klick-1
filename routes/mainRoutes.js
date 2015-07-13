// Home Route
Router.route('/', {
  name: 'home',
  action: function () {
    this.render('home');
    SEO.set({ title: 'Home - ' + Meteor.App.NAME });
  }
});

Router.route('/events', {
  name: 'events',
  action: function () {
    this.render('events');
    SEO.set({ title: 'Events - ' + Meteor.App.NAME });
  }
});

Router.route('/events/:_id', {
  name: 'event',
  action: function () {
    var eventObj = Events.findOne({_id: this.params._id});
    this.render('event', {data: eventObj});
    SEO.set({ title: 'Event - ' + Meteor.App.NAME });
  }
});

Router.route('/events/:_id/edit', {
  name: 'eventEdit',
  onBeforeAction: mustBeAdmin,
  action: function () {
    var eventObj = Events.findOne({_id: this.params._id});
    this.render('eventEdit', {data: eventObj});
    SEO.set({ title: 'Edit Event - ' + Meteor.App.NAME });
  }
});

Router.route('/dashboard', {
  name: 'dashboard',
  onBeforeAction: mustBeAdmin,
  action: function () {
    this.render('dashboard');
    SEO.set({ title: 'Dashboard - ' + Meteor.App.NAME });
  }
});

Router.route('/dashboard/users', {
  name: 'users',
  onBeforeAction: mustBeAdmin,
  action: function () {
    this.render('users');
    SEO.set({ title: 'Users - ' + Meteor.App.NAME });
  }
});

Router.route('/dashboard/configuration', {
  name: 'configuration',
  onBeforeAction: mustBeAdmin,
  action: function () {
    this.render('configuration');
    SEO.set({ title: 'Configuration - ' + Meteor.App.NAME });
  }
});

Router.route('/users/:_id', {
  name: 'user',
  action: function () {
    var userObj = Meteor.users.findOne({_id: this.params._id});
    this.render('user', {data: userObj});
    SEO.set({ title: 'User - ' + Meteor.App.NAME });
  }
});

Router.route('/users/:_id/edit', {
  name: 'userEdit',
  onBeforeAction: mustBeThisUser,
  action: function () {
    var userObj = Meteor.users.findOne({_id: this.params._id});
    this.render('userEdit', {data: userObj});
    SEO.set({ title: 'Edit User - ' + Meteor.App.NAME });
  }
});

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('home');
  } else {
    this.next();
  }
};

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    Router.go('dashboard');
  } else {
    this.next();
  }
};

var mustBeThisUser = function(pause){
  if(Meteor.userId() !== this.params._id){
    Router.go('home');
  } else {
    this.next();
  }
}

var mustBeAdmin = function(pause){
  if(Roles.userIsInRole(Meteor.user(), ['admin'])){
    Router.go('home');
  } else {
    this.next();
  }
}

Router.onBeforeAction(mustBeThisUser, {only: ['userEdit']});
Router.onBeforeAction(mustBeSignedIn, {except: ['home', 'events']});
//Router.onBeforeAction(goToDashboard, {only: ['home']});