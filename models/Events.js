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
      //min: new Date(),
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
    var new_groups;
    var users = doc.users || [];
    if(modifier.$addToSet && modifier.$addToSet.users){
      var newUser = modifier.$addToSet.users;
      users.push(newUser);
      if(doc.manualSort){
        console.log('Manual grouping add')
        new_groups = Groups.addToGroup(users, doc.groupLimit);
      } else {
        console.log('Random grouping add')
        new_groups = Groups.addToRandomGroup(users, doc.groupLimit);
      }
      Meteor.users.update(modifier.$addToSet.users, {$addToSet: {klicks: doc._id}});
    } else if (modifier.$pull && modifier.$pull.users) {
      if(doc.manualSort){
        console.log('Manual grouping remove')
        new_groups = Groups.removeFromGroup(doc.groups,modifier.$pull.users, doc.groupLimit);
      } else {
        console.log('Random grouping remove')
        new_groups = Groups.removeFromRandomGroup(doc.groups,modifier.$pull.users, doc.groupLimit);
      }
       Meteor.users.update(modifier.$pull.users, {$pull: {klicks: doc._id}});
    }

    if(modifier.$set && modifier.$set.groupLimit && !doc.manualSort){
      new_groups = Groups.shuffleIntoGroups(users, modifier.$set.groupLimit)
    }

    if(modifier.$set && !modifier.$set.manualSort && doc.manualSort){
      new_groups = Groups.shuffleIntoGroups(users, doc.groupLimit)
    }

    if (new_groups) {
      if(!modifier.$set){
        modifier.$set = {groups: new_groups};
      }else{
        modifier.$set.groups = new_groups;
      }
    }
  });

  Events.after.update(function (userId, doc, fieldNames, modifier, options) {
    console.log('\n\nUpdating event to: ')
    console.log(doc);
  });
}



    
  




