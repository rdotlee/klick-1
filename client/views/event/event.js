Template['event'].helpers({
  viewable: function () {
    var KS = Settings.findOne({});
    return moment().add(KS.release_frame, 'days').isAfter(this.date);
  },

});

Template['event'].events({
});
