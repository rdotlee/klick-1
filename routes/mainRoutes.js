// Home Route
Router.route('/', {
  name: 'home',
  waitOn: function(){
    return [Meteor.subscribe("futureEvents")];
  },
  action: function () {
    this.render('home');
    SEO.set({ title: 'Home - ' + Meteor.App.NAME });
  }
});

Router.route('/signup', {
  name: 'signup',
  action: function () {
    this.render('signup');
    SEO.set({ title: 'Sign up - ' + Meteor.App.NAME });
  }
});

Router.route('/admin_login', {
  name: 'admin_login',
  action: function () {
    this.render('admin_login');
    SEO.set({ title: 'Admin Login - ' + Meteor.App.NAME });
  }
});

Router.route('/events', {
  name: 'events',
  waitOn: function(){
    if (Meteor.user()) return [Meteor.subscribe("AllEvents"),  Meteor.subscribe('userData')];
    if (!Meteor.user()) return [Meteor.subscribe("AllEvents")];
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
    return [Meteor.subscribe("Event", this.params._id), Meteor.subscribe("Users")];
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
    return Meteor.subscribe("AllEvents");
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
  waitOn: function(){
    return [Meteor.subscribe('Users'), Meteor.subscribe('Settings')];
  },
  data: function(){
    return {
      users: Meteor.users.find(),
      settings: Settings.findOne({})
    }
  },
  action: function () {
    this.render('configuration');
    SEO.set({ title: 'Configuration - ' + Meteor.App.NAME });
  }
});

Router.route('/users/:_id', {
  name: 'user',
  waitOn: function(){
    return [Meteor.subscribe("pastEvents"),Meteor.subscribe('User',this.params._id)];
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
  waitOn: function(){
    return [Meteor.subscribe("Settings"), Meteor.subscribe('User',this.params._id)];
  },
  data: function(){
    return {
      user: Meteor.users.findOne({_id: this.params._id}),
      config: Settings.findOne({})
    }
  },
  action: function () {
    this.render('userEdit');
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
  if(Meteor.userId() === this.params._id || Roles.userIsInRole(Meteor.userId(), ['admin'])){
    this.next();
  } else {
    Router.go('home');
  }
}

var mustBeAdmin = function(pause){
  if(Roles.userIsInRole(Meteor.user(), ['admin'])){
    Router.go('home');
  } else {
    this.next();
  }
}

var complete_profile = function () {
  var user = Meteor.user();
  return user.profile.firstName &&
    user.profile.lastName &&
    user.profile.netid &&
    user.profile.gradYear &&
    user.profile.program &&
    user.profile.section &&
    user.profile.kwesttrip;
}

var profileFilled = function(pause){
  if(Meteor.user() && !complete_profile()){
    Router.go('userEdit', {_id: Meteor.userId});
  } else {
    this.next();
  }
}

Router.onBeforeAction(mustBeThisUser, {only: ['userEdit']});
Router.onBeforeAction(mustBeSignedIn, {except: ['home', 'events','signup', 'admin_login']});
Router.onBeforeAction(profileFilled, {except: ['userEdit']});
//Router.onBeforeAction(goToDashboard, {only: ['home']});