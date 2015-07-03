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
    }
});

Template['events'].events({
});
