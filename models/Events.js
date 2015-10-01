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
    description: {
      type: String,
      optional: true,
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
    gcalId: {
      type: String,
      label: 'Gcal ID',
      optional: true,
      autoform: {
        omit: true
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
    var new_groups;
    var users = doc.users || [];
    var config = Settings.findOne({});
    if(modifier.$addToSet && modifier.$addToSet.users){
      var newUser = modifier.$addToSet.users;
      users.push(newUser);
      if(doc.manualSort || moment().add(config.release_frame, 'days').isAfter(doc.date)){
        console.log('Adding, Manual grouping add or within release')
        new_groups = Groups.addToGroup(doc.groups,modifier.$addToSet.users, doc.groupLimit);
      } else {
        console.log('Adding, Random grouping add')
        new_groups = Groups.addToRandomGroup(users, doc.groupLimit);
      }
      Meteor.users.update(modifier.$addToSet.users, {$addToSet: {klicks: doc._id}});
    } else if (modifier.$pull && modifier.$pull.users) {
      var removeUser = modifier.$pull.users;
      users = _.filter(users, function(id){ return id !== removeUser});
      if(doc.manualSort || moment().add(config.release_frame, 'days').isAfter(doc.date)){
        console.log('Manual grouping remove')
        new_groups = Groups.removeFromGroup(doc.groups,modifier.$pull.users, doc.groupLimit);
      } else {
        console.log('Random grouping remove')
        new_groups = Groups.removeFromRandomGroup(users, doc.groupLimit);
      }
       Meteor.users.update(modifier.$pull.users, {$pull: {klicks: doc._id}});
    }

    if(modifier.$set && modifier.$set.groupLimit && !doc.manualSort){
      new_groups = Groups.shuffleIntoGroups(users, modifier.$set.groupLimit)
    }

    if(modifier.$set && modifier.$set.manualSort === false && doc.manualSort){
      console.log('Reshuffling groups for pref change')
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

  Events.after.insert(function (userId, doc){
    var config = Settings.findOne({});
    var calendarOwner = Meteor.users.findOne(config.calendarOwner);
    if(calendarOwner){
      console.log(calendarOwner)
      var endDate = moment(doc.date).add(1, 'hours').toDate();
      var options = {
        user: calendarOwner,
        data:{
          summary: doc.title,
          start: {
            dateTime: doc.date
          },
          end: {
            dateTime: endDate
          },
          anyoneCanAddSelf: false,
          guestsCanSeeOtherGuests: false,
          guestsCanInviteOthers: false,
          location: doc.location.street + ", " + doc.location.city,
          visibility: 'private'
        }
      };

      console.log('================Options===================');
      console.log(options);
      console.log('================Options===================');

      GoogleApi.post('calendar/v3/calendars/primary/events', options, function(res, data){
        console.log(res)
        console.log(data)
        var calId = data.id;
        Events.update(doc._id, {$set: {gcalId: calId}});
      });
    }
  })

  Events.after.update(function (userId, doc, fieldNames, modifier, options) {
    console.log('\n\n===========================================\n===========================================');
    console.log('\n\nUpdating event to: ')
    console.log(doc);

    var config = Settings.findOne({});
    var calendarOwner = Meteor.users.findOne(config.calendarOwner);
    var invited = Meteor.users.find({_id: {$in: doc.users}}).fetch();
    var invited = invited.map(function(user){
      return { 
        email: user.emails[0].address,
        displayName: user.profile.firstName + " "+ user.profile.lastName
      }
    });

    if(calendarOwner){
      var endDate = moment(doc.date).add(1, 'hours').toDate();
      var options = {
        user: calendarOwner,
        query:{
          sendNotifications: true,
        },
        data:{
          summary: doc.title,
          attendees: invited,
          start: {
            dateTime: moment(doc.date).format("YYYY-MM-DDTHH:mm:ssZ")
          },
          end: {
            dateTime: moment(endDate).format("YYYY-MM-DDTHH:mm:ssZ")
          },
          anyoneCanAddSelf: false,
          guestsCanSeeOtherGuests: false,
          guestsCanInviteOthers: false,
          location: doc.location.street + ", " + doc.location.city,
          visibility: 'private'
        }
      };

      GoogleApi.patch('calendar/v3/calendars/primary/events/' + doc.gcalId+'?sendNotifications=true', options, function(res, data){
        console.log(res, data);
      });
    }
  });

  Events.after.remove(function (userId, doc){
    if(calendarOwner){
      var endDate = moment(doc.date).add(1, 'hours').toDate();
      var options = {
        user: calendarOwner,
        query:{
          sendNotifications: true,
        }
      };

      GoogleApi.delete('calendar/v3/calendars/primary/events' + doc.gcalId +'?sendNotifications=true', options, function(res, data){
        console.log(res, data);
      });
    }
  });
}



    
  




