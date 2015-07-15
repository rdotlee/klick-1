Events = new Mongo.Collection('Events');

SimpleSchema.messages({
  wrongRole: "Wrong Role",
  eventFull: "The event is full"
});

AddressSchema = new SimpleSchema({
  street: {
    type: String,
    max: 100
  },
  city: {
    type: String,
    max: 50
  },
  state: {
    type: String,
    autoform: {
      options: {'AL': 'AL', 'AK': 'AK', 'AZ': 'AZ', 'AR': 'AR', 'CA': 'CA', 'CO': 'CO', 'CT': 'CT', 'DC': 'DC', 'DE': 'DE', 'FL': 'FL', 'GA': 'GA', 'HI': 'HI', 'ID': 'ID', 'IL': 'IL', 'IN': 'IN', 'IA': 'IA', 'KS': 'KS', 'KY': 'KY', 'LA': 'LA', 'ME': 'ME', 'MD': 'MD', 'MA': 'MA', 'MI': 'MI', 'MN': 'MN', 'MS': 'MS', 'MO': 'MO', 'MT': 'MT', 'NE': 'NE', 'NV': 'NV', 'NH': 'NH', 'NJ': 'NJ', 'NM': 'NM', 'NY': 'NY', 'NC': 'NC', 'ND': 'ND', 'OH': 'OH', 'OK': 'OK', 'OR': 'OR', 'PA': 'PA', 'RI': 'RI', 'SC': 'SC', 'SD': 'SD', 'TN': 'TN', 'TX': 'TX', 'UT': 'UT', 'VT': 'VT', 'VA': 'VA', 'WA': 'WA', 'WV': 'WV', 'WI': 'WI', 'WY': 'WY'}
    }
  },
  zip: {
    type: String,
    regEx: /^[0-9]{5}$/
  }
});

Events.attachSchema(
    new SimpleSchema({
    title: {
      type: String
    },
    area: {
      type: String,
      label: 'Area',
      autoform: {
        options: function () {
          return _.map(Areas.find().fetch(), function (area) {
            return {label: area.name, value: area._id};
          });
        }
      }
    },
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date;
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date};
        } else {
          this.unset();
        }
      },
      autoform: {
        omit: true
      }
    },
    eventLimit:{
      type: Number,
      label: 'Attendee Limit',
      min: 1
    },
    groupLimit:{
      type: Number,
      label: 'Group Size',
      min: 2
    },
    users: {
      type: [String],
      label: 'People registered',
      optional: true,
      custom: function(){
        if(this.field('eventLimit').isSet && this.value.length > this.field('eventLimit').value){
          return 'eventFull';
        } 
      },
      autoform: {
        omit: true
      },
      defaultValue: []
    },
    groups: {
      type: Array,
      label: 'Groups',
      optional: true,
      autoform: {
        omit: true
      }
    },
    'groups.$': {
      type: [String],
      label: 'Group',
      optional: true,
      autoform: {
        omit: true
      }
    },
    isLocked: {
      type: Boolean,
      label: "Event Locked",
      defaultValue: false,
      optional: true,
      autoform: {
        omit: true
      }
    },
    location: {
      type: AddressSchema
    },
    manualSort: {
      type: Boolean,
      label: "Manual group sorting",
      defaultValue: false,
      optional: true,
      autoform: {
        omit: true
      }
    },
    date: {
      type: Date,
      label: 'Date',
      min: new Date(),
      autoform: {
        afFieldInput: {
          type: "bootstrap-datetimepicker"
        }
      }
    }
  })
);

// Collection2 already does schema checking
// Add custom permission rules if needed
if (Meteor.isServer) {
  Events.allow({
    insert : function (userId, doc) {
      return true
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

  Events.before.update(function (userId, doc, fieldNames, modifier, options) {
    var groups = modifier.$set.groups;
  });
}


// var clusterfck = Meteor.npmRequire("clusterfck");
// var Groups = {};

// Groups.cluster = function(users){
//   var clusters = clusterfck.kmeans(users, 2, Groups.getUserDistance)
//   console.log(clusters);
//   //return clusters;
// };

// Groups.getUserDistance = function(a,b){
//   var genderD = 10;
//   if(a.profile.gender === b.profile.gender){
//     genderD = 0;
//   }
//   var lastnameD = 20;
//   if(a.profile.lastName === b.profile.lastName){
//     genderD = 0;
//   }
//   return Math.sqrt(genderD*genderD + lastnameD*lastnameD);
// }

// Groups.getGroupDistance = function(group){
//   return 0;
// }

// Groups.getGroupsDistance = function(groups){
//   return 0;
// }



    
  




