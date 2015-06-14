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

Router.route('/dashboard', {
  name: 'dashboard',
  action: function () {
    this.render('dashboard');
    SEO.set({ title: 'Dashboard - ' + Meteor.App.NAME });
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

Router.onBeforeAction(mustBeSignedIn, {except: ['home', 'events']});
Router.onBeforeAction(goToDashboard, {only: ['home']});