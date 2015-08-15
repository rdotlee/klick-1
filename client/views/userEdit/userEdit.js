Template['userEdit'].helpers({
});

Template['userEdit'].events({
});

Template['userEdit'].onRendered(function(){
  AutoForm.addHooks('updateUserForm', {
    onSuccess: function (formType, result) {
      var profileSet = this.updateDoc.$set;
      var config = Settings.findOne({});
      addToConfig(profileSet,'organizations',config);
      addToConfig(profileSet,'education',config);
      addToConfig(profileSet,'nationalities',config);
      addToConfig(profileSet,'languages',config);
      Router.go('user', {_id: this.docId});
      return false;
    },

  }); 
});

var isInConfig = function(option, key, config){
  if (!config[key]) return false;
  for (var i = config[key].length - 1; i >= 0; i--) {
    if (config[key].value === option) {
      return true;
    }
  }
  return false;
}

var addToConfig = function(profileSet, key,config) {
  if (profileSet['profile.'+key]) {
    var arr = profileSet['profile.'+key];
    _.each(arr, function(option){
      if (!isInConfig(option, key, config)) {
        var mod = {$push: {}};
        mod.$push[key] = {value: option};
        Settings.update(config._id,mod);
      }
    })
  }
}