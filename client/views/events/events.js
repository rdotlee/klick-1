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
      var params = Session.get('eventsParams');
      return Events.find(params,{sort: {date: 1}});
    },

    ifInArea: function(area, eventArea){
      return area === eventArea;
    },

    isFilter: function(filter){
      return Session.get('filter') === filter;
    }
});

Template['events'].events({
  'click #all-events': function(event, template){
    Session.set('eventsParams', {
      date: {
        $gte: moment().toDate()
      }
    });
    Session.set('filter', 'all');
  },
  'click #reg-events': function(event, template){
    Session.set('filter', 'reg');
    Session.set('eventsParams', {
      $and: [
        {
          users: {
            $all: [Meteor.userId()]
          }
        },
        {
          date: {
            $gte: moment().toDate()
          }
        }
      ]
    });
  },
  'click #past-events': function(event, template){
    Session.set('filter', 'past');
    Session.set('eventsParams', {
      $and: [
        {
          users: {
            $all: [Meteor.userId()]
          }
        },
        {
          date: {
            $lt: moment().toDate()
          }
        }
      ]
    });
  },
});

Template['events'].onRendered(function(){
  Session.set('filter', 'all');
  Session.set('eventsParams', {
    date: {
      $gte: moment().toDate()
    }
  });
})

