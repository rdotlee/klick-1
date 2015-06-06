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
    SEO.set({ title: 'Home - ' + Meteor.App.NAME });
  }
});