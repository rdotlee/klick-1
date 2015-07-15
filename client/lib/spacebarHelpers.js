Template.registerHelper('debug', function (optionalValue) {
  if (typeof console !== "undefined" || typeof console.log !== "undefined") {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }

    return '';
  }

  // For IE8
  alert(this);

  if (optionalValue) {
    alert(optionalValue);
  }

  return '';
});

Template.registerHelper('constant', function (what) {
  return Meteor.App[what.toUpperCase()];
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM/DD/YYYY');
});

Template.registerHelper('formatDateTime', function(date) {
  return moment(date).format('MM/DD/YYYY @ hh:mm a');
});

Template.registerHelper('repeat', function(times) {
  var countArr = [];
    for (var i=0; i<times; i++){
      countArr.push(i);
    }
    return countArr;
});