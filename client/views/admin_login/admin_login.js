Template['admin_login'].helpers({
});

Template['admin_login'].events({
  'click #google-login': function(event) {
    Meteor.loginWithGoogle({
      requestPermissions: ['https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
      requestOfflineToken: true, 
      forceApprovalPrompt: true
    }, function(err){
        if (err) {
          console.log(err)
          Session.set('error',err.reason)
          throw new Meteor.Error("Google login failed");
        } else {
          Router.go('userEdit', {_id: Meteor.userId})
        }
    });
  },
});
