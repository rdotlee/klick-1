Template['eventEdit'].helpers({
});

Template['eventEdit'].events({
});

Template['eventEdit'].onRendered(function(){
  AutoForm.addHooks('updateEventForm', {
    onSuccess: function (formType, result) {
      Router.go('event', {_id: this.docId});
      return false;
    }
  }); 
});
