
var UserProfile = new SimpleSchema({
    firstName: {
        type: String,
        regEx: /^[a-zA-Z-]{2,25}$/,
        optional: true
    },
    lastName: {
        type: String,
        regEx: /^[a-zA-Z]{2,25}$/,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    organization : {
        type: String,
        regEx: /^[a-z0-9A-z .]{3,30}$/,
        optional: true
    },
    website: {
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    bio: {
        type: String,
        optional: true
    },
    country: {
        type: String,
        optional: true
    },
    languages: {
        type: [String],
        optional: true
    },
    picture: {
        type: String,
        optional: true
    }
});

var UserSchema = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,15}$/
    },
    emails: {
        type: [Object],
        optional: true
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: UserProfile,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: [String],
        optional: true
    }
});

Meteor.users.attachSchema(UserSchema);

if (Meteor.isServer) {
  Meteor.users.allow({
    insert : function (userId, doc) {
      if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
        return true;
      } else {
        return false;
      }
    },
    update : function (userId, doc) {
      if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
        return true;
      } else {
        return false;
      }
    },
    remove : function (userId, doc) {
      if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
        return true;
      } else {
        return false;
      }
    }
  });

  Accounts.onCreateUser(function(options, user) {
    console.log(user);
    user.profile = {};
    if(user.services && user.services.facebook){
      user.username = user.services.facebook.first_name 
      FBGraph.setAccessToken(user.services.facebook.accessToken);
      FBGraph.get("me/picture?type=large", function(err, res) {
        user.profile.picture = res.location;
      });
    } else if (user.services && user.services.linkedin) {
      var linkedin = Linkedin().init(user.services.linkedin.accessToken);
      linkedin.people.me(function(err, $in) {
        user.profile.picture = me['picture-url'];
      });

    } else {
      user.profile.picture = Gravatar.imageUrl(user.emails[0].address);
    }
    return user;
  });

}
