Template['signup'].helpers({
  error: function(){
    return Session.get('error')
  },
  UserSignUp: function() {
    return UserSignUp;
  }
});

Template['signup'].events({

  'submit #register-form' : function(e, t) {


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



AutoForm.addHooks('insertUserForm', {
  onSubmit: function(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault()
    var that = this;
    Accounts.createUser({
      email: insertDoc.email, 
      password : insertDoc.password,
      profile: {
        firstName: insertDoc.firstName,
        lastName: insertDoc.lastName,
        program: insertDoc.program,
        section: insertDoc.section,
        kwesttrip: insertDoc.kwesttrip
      }
    }, function(err){
      if (err) {
        if (err.reason === 'Username already exists.') err.reason = 'Email address already in use'
        that.done(new Error(err.reason));
        Session.set('error', err.reason);
        return false;
      } else {
        that.done();
        Router.go('userEdit', {_id: Meteor.userId});
        return false;
      }
    });
  },
}); 


var UserSignUp = new SimpleSchema({
  firstName: {
      type: String
  },
  lastName: {
      type: String
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Email",
  },
  program: {
      type: String,
      optional: false,
      label: 'Kellogg Program',
      allowedValues: ['MMM', '1Y', '2Y', 'JDMBA', 'MDMBA', 'Part-time', 'Executive', 'JV'],
  },
  section: {
      type: String,
      optional: false,
      label: 'Section',
      allowedValues: ['1Y-Hedgehogs','1Y-Roadrunners','Big Dawgs','Bucket Heads','Bull Frogs','Cash Cows','Highlanders','Jive Turkeys','Moose','Poets','N/A',],
  },
  kwesttrip: {
      type: String,
      optional: false,
      label: 'KWEST Trip',
      allowedValues: ['Amazing Race-2013','Amazing race-2014','Argentina-2014','Arubacao-2014','Belize-2014','Berlin/Krakow-2014','Bike Holland-2014','Brazil-2013','Chile-2013','Chile-2014','Costa Rica-2014','Croatia-2013','Croatia-2014','Czechoslovakia-2014','Denmark/Austria-2014','Dominican Republic-2013','Ecuador-2014','France-2013','Georgia/Armenia-2014','Greece-2014','Guatemala-2014','Hungary-2014','Iceland-2014','Ireland-2014','Italy-2014','Mystery-2014','Nicaragua-2013','Nicaragua-2014','Oman-2014','Panama-2014','Peru-2013','Peru-2014','Portugal-2014','Puerto Rico-2014','Romania-2013','Romania-2014','South Africa-2013','Spain - Mediterranean-2013','Spain - Northern-2013','Spain Mediterranean-2014','St. Lucia-2014','Sweden-2014','Thailand-2013','Thailand-2014','Turkey-2014','USA Virgin Islands-2013','Vietnam-2014','Zanzibar-2014','N/A'],
  },
  password: {
    type: String,
    label: "Password",
    min: 6,
    autoform: {
      type: 'password'
    },
  },
  passwordConfirmation: {
    type: String,
    autoform: {
      type: 'password'
    },
    min: 6,
    label: "Password confirmation",
    custom: function () {
      if (this.value != this.field('password').value) {
        return "passwordMissmatch";
      }
    }
  }
});

UserSignUp.messages({
  passwordMissmatch: "Passwords do not match"
});
