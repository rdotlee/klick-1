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
      FBGraph.get("me/picture?type=large", function(res, err){
        console.log(res);
        console.log(err);
        // Meteor.users.update(user._id, {
        //   $set: {
        //     'profile.picture': res.location
        //   }
        // });
      });
    }
});