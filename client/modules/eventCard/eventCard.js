Template['eventCard'].helpers({

});

Template['eventCard'].events({
  "click #register": function (event, template) {
    console.log(this);
    Events.update(this._id,{
      $addToSet: {users: Meteor.userId()}
    })
  },
});
