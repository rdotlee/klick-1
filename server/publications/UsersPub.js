Meteor.publish('Users', function () {
  return Meteor.users.find({}, {sort: {'profile.lastName':1}});
});

Meteor.publish('User', function (id) {
  return Meteor.users.find({_id: id});
});


Meteor.methods({
    'getFBPhoto': function(){
      var user = Meteor.user();
      FBGraph.setAccessToken(user.services.facebook.accessToken);
      var fb_get = Meteor.wrapAsync(FBGraph.get,FBGraph);
      var results = fb_get("me/picture?type=large");
      Meteor.users.update(user._id, {
        $set: {
          'profile.picture': results.location
        }
      });
    }
});

Meteor.publish('userData', function() {
  if(!this.userId) return null;
  return Meteor.users.find(this.userId, {fields: {
    canceledEvents: 1,
  }});
});