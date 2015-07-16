Template['userEdit'].helpers({
});

Template['userEdit'].events({
});

Template['userEdit'].onRendered(function(){
  AutoForm.addHooks('updateUserForm', {
    onSuccess: function (formType, result) {
      Router.go('user', {_id: this.docId});
      return false;
    }
  }); 
});
