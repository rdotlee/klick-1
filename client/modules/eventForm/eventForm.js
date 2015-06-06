Template['eventForm'].helpers({
});

Template['eventForm'].events({
  "submit .new-event": function (event) {
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Events.insert({
      title: text,
      createdAt: new Date() // current time
    });

    // Clear form
    event.target.text.value = "";

    // Prevent default form submit
    return false;
  }
});
