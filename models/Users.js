
var UserProfile = new SimpleSchema({
  firstName: {
      type: String,
      regEx: /^[a-zA-Z-]{2,25}$/,
  },
  lastName: {
      type: String,
      regEx: /^[a-zA-Z]{2,25}$/,
  },
  birthday: {
      type: Date,
      optional: true
  },
  gender: {
      type: String,
      allowedValues: ['male', 'female'],
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
  gradYear: {
      type: Number,
      optional: true,
      label: 'Class of',
      min: 2000
  },
  program: {
      type: String,
      optional: true,
      label: 'Kellogg Program',
      allowedValues: ['MMM', 'ONE-YEAR MBA', 'TWO-YEAR MBA'],
  },
  organizations: {
      type: [String],
      optional: true,
      label: 'Companies and Organizations',
  },
  'organizations.$': {
      type: String,
      autoform: {
        type: "typeahead",
        afFieldInput: {
          typeaheadOptions: {
            minLength: 1
          },
          typeaheadDatasets: {
            source: function findMatches(q, cb) {
              var matches, substringRegex;
              var config = Settings.findOne({});
              var strs = config.organizations;
              if (!strs) return;
              matches = [];
              substrRegex = new RegExp(q, 'i');
              $.each(strs, function(i, str) {
                if (substrRegex.test(str.value)) {
                  matches.push(str);
                }
              });

              cb(matches);
            }
          }
        }
      }
  },
  education: {
      type: [String],
      optional: true,
  },
  'education.$': {
      type: String,
      autoform: {
        type: "typeahead",
        afFieldInput: {
          typeaheadOptions: {
            minLength: 3
          },
          typeaheadDatasets: {
            source: function findMatches(q, cb) {
              var matches, substringRegex;
              var config = Settings.findOne({});
              var strs = config.education;
              matches = [];
              substrRegex = new RegExp(q, 'i');
              $.each(strs, function(i, str) {
                if (substrRegex.test(str.value)) {
                  matches.push(str);
                }
              });

              cb(matches);
            }
          }
        }
      }
  },
  nationalities: {
      type: [String],
      optional: true,
  },
  'nationalities.$': {
      type: String,
      autoform: {
        type: "typeahead",
        afFieldInput: {
          typeaheadOptions: {
            minLength: 2
          },
          typeaheadDatasets: {
            source: function findMatches(q, cb) {
              var matches, substringRegex;
              var config = Settings.findOne({});
              var strs = config.countries;
              matches = [];
              substrRegex = new RegExp(q, 'i');
              $.each(strs, function(i, str) {
                if (substrRegex.test(str.value)) {
                  matches.push(str);
                }
              });

              cb(matches);
            }
          }
        }
      }
  },
  languages: {
      type: [String],
      optional: true,
  },
  'languages.$': {
      type: String,
      autoform: {
        type: "typeahead",
        afFieldInput: {
          typeaheadOptions: {
            minLength: 3
          },
          typeaheadDatasets: {
            source: function findMatches(q, cb) {
              var matches, substringRegex;
              var config = Settings.findOne({});
              var strs = config.languages;
              matches = [];
              substrRegex = new RegExp(q, 'i');
              $.each(strs, function(i, str) {
                if (substrRegex.test(str.value)) {
                  matches.push(str);
                }
              });

              cb(matches);
            }
          }
        }
      }
  },
  picture: {
      type: String,
      optional: true
  }
});

var UserSchema = new SimpleSchema({
    username: {
        type: String,
        optional: true,
        autoform: {
            omit: true
        }
    },
    emails: {
        type: [Object],
        optional: true,
        defaultValue: [],
        minCount: 0,
        autoform: {
            omit: true
        }
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date,
        autoform: {
            omit: true
        }
    },
    profile: {
        type: UserProfile,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true,
        autoform: {
            omit: true
        }
    },
    roles: {
        type: [String],
        optional: true,
        autoform: {
            omit: true
        }
    },
    klicks: {
        type: [String],
        optional: true,
        autoform: {
            omit: true
        }
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

  Accounts.validateNewUser(function (user) {
    var email_regex = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9._%+-]*northwestern\.edu$","i"); 
    if (user.emails.length >= 1){
      for (var i = user.emails.length - 1; i >= 0; i--) {
        if(email_regex.test(user.emails[i].address)) {
          return true;
        }
      }
    }
    throw new Meteor.Error(403, "You must use a Northwestern University Email");
  });

  Accounts.onCreateUser(function(options, user) {
    if(!user.emails){
        user.emails = [];
    }
    user.profile = options.profile || {};
    if(user.services && user.services.facebook){
      user = getFacebookProfile(user);
    } else if (user.services && user.services.google) {
      user.username = user.services.google.email;
      user.emails.push({address: user.services.google.email, verified: false});
      user.profile.picture = user.services.google.picture;
      user.profile.firstName = user.services.google.given_name;
      user.profile.lastName = user.services.google.family_name;
    } else {
      user.username = options.email;
      user.profile.picture = Gravatar.imageUrl(options.email,{
        size: 200,
        default: 'mm'
      });
    }
    return user;
  });

  function getFacebookProfile(user){
    user.username = user.services.facebook.email; 
    user.profile.firstName = user.services.facebook.first_name;
    user.profile.lastName = user.services.facebook.last_name;
    user.profile.gender = user.services.facebook.gender;
    user.profile.lastName = user.services.facebook.last_name;
    user.emails.push({address: user.services.facebook.email, verified: false});

    FBGraph.setAccessToken(user.services.facebook.accessToken);
    var fb_get = Meteor.wrapAsync(FBGraph.get,FBGraph);
    var results = fb_get("me/picture?type=large");
    console.log(results)
    user.profile.picture = results.location;
    return user;
  }


}
