Events = new Mongo.Collection('Events');

SimpleSchema.messages({
  wrongRole: "Wrong Role",
  eventFull: "The event is full"
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
      custom: function(){
        if(this.field('eventLimit').isSet && this.value.length > this.field('eventLimit').value){
          return 'eventFull';
        } 
      },
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
    insert : function () {
      return true;
    },
    update : function () {
      return true;
    },
    remove : function () {
      return true;
    }
  });
}
