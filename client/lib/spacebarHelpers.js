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

Template.registerHelper('secondsToDays', function(seconds) {
  seconds = seconds*1000;
  var time = {
    years : Math.round(moment.duration(seconds, 'milliseconds').years()),
    months : Math.round(moment.duration(seconds, 'milliseconds').months()),
    days : Math.round(moment.duration(seconds, 'milliseconds').days()),
    hours : Math.round(moment.duration(seconds, 'milliseconds').hours()),
    minutes : Math.round(moment.duration(seconds, 'milliseconds').minutes()),
    seconds : Math.round(moment.duration(seconds, 'milliseconds').seconds())
  };

  function humanize(time){
    var o = '';
    for(key in time){
        if(time[key] > 0){
            var word = key;
            if  (time[key] === 1) {
              word = word.substring(0, word.length - 1);
            }
            if(o === ''){
                o += time[key] + ' ' + word + ' ';
            }else{
                return o + 'and ' + time[key] + ' ' + word;
            }
        }
    }
    return o;
  }

  return humanize(time);
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).utc().format('MM/DD');
});

Template.registerHelper('formatDateTime', function(date) {
  return moment(date).format('ddd MM/DD @ hh:mm a');
});

Template.registerHelper('repeat', function(times) {
  var countArr = [];
    for (var i=0; i<times; i++){
      countArr.push(i);
    }
    return countArr;
});

Template.registerHelper('twoDecimals', function(num) {
  return Math.round(num * 100) / 100;
});

Template.registerHelper('kellog_pic', function(netid) {
  return "http://www.kellogg.northwestern.edu/images/students/all/"+netid+".jpg";
});

