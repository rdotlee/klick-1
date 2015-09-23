Template['header'].helpers({
  profilePath: function () {
    return '/users/' + Meteor.userId();
  }
});

Template['header'].events({
});

Template['header'].onRendered(function () {
	 $(".navbar-nav li.tc a").click(function(event) {
      $(".navbar-collapse").collapse('hide');
    });
})