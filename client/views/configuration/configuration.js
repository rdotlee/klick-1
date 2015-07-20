Template['configuration'].helpers({
  areas: function() {
    return Areas.find();
  },
});

Template['configuration'].events({
  "submit #area-form": function(event, template){
    Areas.update(this._id, {$set: {name: event.target.name.value}});
  },
  'click #area-delete': function(event, template){
    if(Events.find({area: this._id}).count() > 0){
      alert('You can not delete areas which contain events')
    } else {
      Areas.remove(this._id);
    }
  }
});
