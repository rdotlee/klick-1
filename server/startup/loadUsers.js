function loadUser(user) {
  var userAlreadyExists = typeof Meteor.users.findOne({ emails: { $elemMatch: { address: user.email } } }) === 'object';

  if (!userAlreadyExists) {
    var id;

    id = Accounts.createUser(user);

    if (user.roles.length > 0) {
      Roles.addUsersToRoles(id, user.roles);
    }

  }
}

function loadSettings(settings){
  var settingsExist = Settings.find().count();
  if (settingsExist === 0){
    console.log('Loading settings');
    Settings.insert(settings)
  } else if (settingsExist > 1){
    console.log('Clearing settings');
    Settings.remove({});
  }
}

function loadAreas(area) {
  var alreadyExists = typeof Areas.findOne({ name : area.name }) === 'object';
  if (!alreadyExists) {
    Areas.insert(area)
  }
}

function loadEvent(event,i) {
  var alreadyExists = typeof Events.findOne({ title : event.title }) === 'object';

  if (!alreadyExists) {
    var area = Areas.findOne({name: event.area});
    if(area){
      event.area = area._id;
    }
    event.date = moment().add(i,'days').toJSON();
    Events.insert(event)
  }
}

Meteor.startup(function () {
  var users = YAML.eval(Assets.getText('users.yml'));
  var settings = YAML.eval(Assets.getText('settings.yml'));
  var areas = YAML.eval(Assets.getText('areas.yml'));
  var events = YAML.eval(Assets.getText('events.yml'));

  for (key in users) if (users.hasOwnProperty(key)) {
    loadUser(users[key]);
  }

  loadSettings(settings);

  for (key in areas) if (areas.hasOwnProperty(key)) {
    loadAreas(areas[key]);
  }

  var i = 0;
  for (key in events) if (events.hasOwnProperty(key)) {
    loadEvent(events[key], i);
    i++;
  }

});