Template['signup'].helpers({
  error: function(){
    return Session.get('error')
  }
});

Template['signup'].events({
  'click #facebook-login': function(event) {
      Meteor.loginWithFacebook({}, function(err){
          if (err) {
            Session.set('error',err.reason)
            throw new Meteor.Error("Facebook login failed");
          } else {
            Router.go('userEdit', {_id: Meteor.userId})
          }
      });
  },

  'click #google-login': function(event) {
      Meteor.loginWithGoogle({}, function(err){
          if (err) {
            console.log(err)
            Session.set('error',err.reason)
            throw new Meteor.Error("Google login failed");
          } else {
            Router.go('userEdit', {_id: Meteor.userId})
          }
      });
  },

  'submit #register-form' : function(e, t) {
    e.preventDefault();
    var email = t.find('#account-email').value, 
        password = t.find('#account-password').value,
        firstName = t.find('#account-first-name').value,
        lastName = t.find('#account-last-name').value;

      // Trim and validate the input

    Accounts.createUser({
      email: email, 
      password : password,
      profile: {
        firstName: firstName,
        lastName: lastName
      }
    }, function(err){
      if (err) {
        console.log(err)
        if (err.reason === 'Username already exists.') err.reason = 'Email address already in use'
        Session.set('error',err.reason)
      } else {
        Router.go('userEdit', {_id: Meteor.userId})
      }
    });

    return false;
  }
});
