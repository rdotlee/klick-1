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
  waitOn: function(){
    return Meteor.subscribe("Events");
  },
  action: function () {
    this.render('events');
    SEO.set({ title: 'Events - ' + Meteor.App.NAME });
  }
});

Router.route('/events/:_id', {
  name: 'event',
  waitOn: function(){
    return [Meteor.subscribe("Event", this.params._id),Meteor.subscribe('Settings'),Meteor.subscribe('Users')];
  },
  data: function(){
    return { 
      eventData: Events.findOne({_id: this.params._id}),
      config: Settings.findOne({})
    }
  },
  action: function () {
    this.render('event');
    SEO.set({ title: 'Event - ' + Meteor.App.NAME });
  }
});

Router.route('/events/:_id/edit', {
  name: 'eventEdit',
  onBeforeAction: mustBeAdmin,
  waitOn: function(){
    return Meteor.subscribe("Event", this.params._id);
  },
  data: function(){
    return Events.findOne({_id: this.params._id});
  },
  action : function () {
    this.render('eventEdit');
    SEO.set({ title: 'Event - ' + Meteor.App.NAME });
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
  waitOn: function(){
    return Meteor.subscribe('Users',this.params._id);
  },
  data: function(){
    return Meteor.users.find();
  },
  action: function () {
    this.render('users');
    SEO.set({ title: 'Users - ' + Meteor.App.NAME });
  }
});

Router.route('/dashboard/events', {
  name: 'eventList',
  onBeforeAction: mustBeAdmin,
  waitOn: function(){
    return Meteor.subscribe("Events");
  },
  data: function(){
    return Events.find({});
  },
  action: function () {
    this.render('eventList');
    SEO.set({ title: 'Events - ' + Meteor.App.NAME });
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
  waitOn: function(){
    return [Meteor.subscribe("Events"),Meteor.subscribe('User',this.params._id)];
  },
  data: function(){
    return Meteor.users.findOne({_id: this.params._id})
  },
  action: function () {
    this.render('user');
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