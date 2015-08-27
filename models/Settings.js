Settings = new Mongo.Collection('Settings');

Settings.attachSchema(
    new SimpleSchema({
    release_frame: {
      type: Number
    },
    calendarOwner: {
      type: String,
      label: 'Calendar Owner',
      optional: true,
      autoform: {
        options: function () {
          return _.map(Meteor.users.find().fetch(), function (user) {
            return {label: user.profile.firstName + " " + user.profile.lastName, value: user._id};
          });
        }
      }
    },
    languages: {
      type: [Object],
      label: 'Languages',
      optional: true,
    },
    'languages.$.value': {
      type: String,
      label: 'Name',
      optional: true,
    },
    education: {
      type: [Object],
      label: 'Schools',
      optional: true,
    },
    'education.$.value': {
      type: String,
      label: 'Name',
      optional: true,
    },
    organizations: {
      type: [Object],
      label: 'Companies',
      optional: true,
    },
    'organizations.$.value': {
      type: String,
      label: 'Name',
      optional: true,
    },
    nationalities: {
      type: [Object],
      label: 'Companies',
      optional: true,
    },
    'nationalities.$.value': {
      type: String,
      label: 'Name',
      optional: true,
    },
  })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Settings.allow({
    insert : function (userId, doc) {
      return true;
    },
    update : function (userId, doc) {
      return true;
    },
    remove : function (userId, doc) {
      if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
        return true;
      } else {
        return false;
      }
    }
  });
}
