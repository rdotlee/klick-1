Template['events'].helpers({
    eventsByArea: function () {
      var areas = Areas.find();
      var events = Events.find();
      var eventsByArea = [];
      _.each(areas,function(area){
        var areaEvents = {
          name: area.name,
          events: []
        }
        _.each(events,function(event){
          if(event.area === area._id){
            areaEvents.events.push(event);
          }
        });
        eventsByArea.push(areaEvents);
      });

      return eventsByArea;
    },

    areas: function(){
      return Areas.find();
    },

    events: function(){
      return Events.find();
    },

    ifInArea: function(area, eventArea){
      return area === eventArea;
    },

    filter: function(event){
      if (Session.get('allEvents')) return true;

      if(event.users && _.indexOf(event.users, Meteor.userId()) != -1){
        return true;
      } else {
        return false;
      }
    },

    allEvents: function(){
      return Session.get('allEvents');
    }
});

Template['events'].events({
  'click #all-events': function(event, template){
    Session.set('allEvents', true);
  },
  'click #reg-events': function(event, template){
    Session.set('allEvents', false);
  },
});

Template['events'].onRendered(function(){
  Session.set('allEvents', true);
})

