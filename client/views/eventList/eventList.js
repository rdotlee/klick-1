Template['eventList'].helpers({
  settings: function () {
      return {
          collection: Events,
          rowsPerPage: 10,
          showFilter: false,
          rowClass: 'clickable',
          fields: [
            {key:'date', label:'Date', fn: function (value, object) { return moment(object.date).format('MM/DD/YYYY '); }},
            {key:'title', label:'Title'},
            {key:'location', label:'Address', fn: function (value, object) { return object.location.street + ", " + object.location.city; }},
            {key:'eventLimit', label:'Event Limit'},
            {key:'groupLimit', label:'Group Limit'},
            {key:'users', label:'# of atendees', fn: function(value, object){return object.users.length;}},
          ]
      };
  }
});

Template['eventList'].events({
  'click .reactive-table tbody tr': function (event) {
    event.preventDefault();
    var eventOb = this;
    Router.go('event',{_id: eventOb._id})
  }
});
