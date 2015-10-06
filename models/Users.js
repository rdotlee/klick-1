
var UserProfile = new SimpleSchema({
  firstName: {
      type: String
  },
  lastName: {
      type: String
  },
  birthday: {
      type: Date,
      optional: true,
      defaultValue: new Date(),
  },
  gender: {
      type: String,
      allowedValues: ['male', 'female'],
      optional: true
  },
  website: {
      type: String,
      optional: true
  },
  Tagline: {
      type: String,
      optional: true,
      label: 'Tagline'
  },
  gradYear: {
      type: Number,
      optional: true,
      label: 'Class of',
      min: 2000,
      autoform: {
        options: function () {
          var options = [];
          for (var i = 4 - 1; i >= 0; i--) {
            var year = moment().year() + i;
            options.push({label: year, value: year});
          };
          return options;
        }
      }
  },
  program: {
      type: String,
      optional: true,
      label: 'Kellogg Program',
      allowedValues: ['MMM', '1Y', '2Y', 'JDMBA', 'MDMBA', 'Part-time', 'Executive', 'JV'],
  },
  section: {
      type: String,
      optional: true,
      label: 'Section',
      allowedValues: ['1Y-Hedgehogs','1Y-Roadrunners','Big Dawgs','Bucket Heads','Bull Frogs','Cash Cows','Highlanders','Jive Turkeys','Moose','Poets','N/A',],
  },
  kwesttrip: {
      type: String,
      optional: true,
      label: 'KWEST Trip',
      allowedValues: ['Amazing Race-2013','Amazing race-2014','Argentina-2014','Arubacao-2014','Belize-2014','Berlin/Krakow-2014','Bike Holland-2014','Brazil-2013','Chile-2013','Chile-2014','Costa Rica-2014','Croatia-2013','Croatia-2014','Czechoslovakia-2014','Denmark/Austria-2014','Dominican Republic-2013','Ecuador-2014','France-2013','Georgia/Armenia-2014','Greece-2014','Guatemala-2014','Hungary-2014','Iceland-2014','Ireland-2014','Italy-2014','Mystery-2014','Nicaragua-2013','Nicaragua-2014','Oman-2014','Panama-2014','Peru-2013','Peru-2014','Portugal-2014','Puerto Rico-2014','Romania-2013','Romania-2014','South Africa-2013','Spain - Mediterranean-2013','Spain - Northern-2013','Spain Mediterranean-2014','St. Lucia-2014','Sweden-2014','Thailand-2013','Thailand-2014','Turkey-2014','USA Virgin Islands-2013','Vietnam-2014','Zanzibar-2014','N/A'],
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
    },
    cancelCount: {
      type: Number,
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
    // var email_regex = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9._%+-]*northwestern\.edu$","i"); 
    // if (user.emails.length >= 1){
    //   for (var i = user.emails.length - 1; i >= 0; i--) {
    //     if(email_regex.test(user.emails[i].address)) {
    //       return true;
    //     }
    //   }
    // }
    // throw new Meteor.Error(403, "You must use a Northwestern University Email");
    return true;
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
    
    return user;
  }


}
