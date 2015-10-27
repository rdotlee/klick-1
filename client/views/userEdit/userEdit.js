Template['userEdit'].helpers({
  'incomplete_profile': function () {
    var user = Meteor.user();
    return !(user.profile.firstName &&
      user.profile.lastName &&
      user.profile.netid &&
      user.profile.gradYear &&
      user.profile.program &&
      user.profile.section &&
      user.profile.kwesttrip);
  },

  'profile_schema': function() {
    return UserSchema;
  }
});

Template['userEdit'].events({
});


AutoForm.addHooks('updateUserForm', {
  onSuccess: function (formType, result) {
    Router.go('user', {_id: this.docId});
    return false;
  },

}); 

var UserProfile = new SimpleSchema({
  firstName: {
      type: String
  },
  lastName: {
      type: String
  },
  netid: {
      type: String,
      optional: false,
      label: 'NetID'
  },
  birthday: {
      type: Date,
      optional: true,
      defaultValue: new Date(),
  },
  gender: {
      type: String,
      allowedValues: ['Male', 'Female'],
      optional: true
  },
  tagline: {
      type: String,
      optional: true,
      label: 'Tagline'
  },
  gradYear: {
      type: Number,
      optional: true,
      label: 'Class of',
      min: 2000,
      autoform: {
        options: function () {
          var options = [];
          for (var i = 4 - 1; i >= 0; i--) {
            var year = moment().year() + i;
            options.push({label: year, value: year});
          };
          return options;
        }
      }
  },
  program: {
      type: String,
      optional: false,
      label: 'Kellogg Program',
      allowedValues: ['MMM', '1Y', '2Y', 'JDMBA', 'MDMBA', 'Part-time', 'Executive', 'JV'],
  },
  section: {
      type: String,
      optional: false,
      label: 'Section',
      allowedValues: ['1Y-Hedgehogs','1Y-Roadrunners','Big Dawgs','Bucket Heads','Bull Frogs','Cash Cows','Highlanders','Jive Turkeys','Moose','Poets','N/A',],
  },
  kwesttrip: {
      type: String,
      optional: false,
      label: 'KWEST Trip',
      allowedValues: ['Amazing Race-2013','Amazing race-2014','Argentina-2014','Arubacao-2014','Belize-2014','Berlin/Krakow-2014','Bike Holland-2014','Brazil-2013','Chile-2013','Chile-2014','Costa Rica-2014','Croatia-2013','Croatia-2014','Czechoslovakia-2014','Denmark/Austria-2014','Dominican Republic-2013','Ecuador-2014','France-2013','Georgia/Armenia-2014','Greece-2014','Guatemala-2014','Hungary-2014','Iceland-2014','Ireland-2014','Italy-2014','Mystery-2014','Nicaragua-2013','Nicaragua-2014','Oman-2014','Panama-2014','Peru-2013','Peru-2014','Portugal-2014','Puerto Rico-2014','Romania-2013','Romania-2014','South Africa-2013','Spain - Mediterranean-2013','Spain - Northern-2013','Spain Mediterranean-2014','St. Lucia-2014','Sweden-2014','Thailand-2013','Thailand-2014','Turkey-2014','USA Virgin Islands-2013','Vietnam-2014','Zanzibar-2014','N/A'],
  },
  nationality: {
      type: String,
      optional: true,
      label: 'Nationality',
      allowedValues: ["United States", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic People's Republic of Korea (North Korea)", "Democratic Republic of the Cong", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic (Laos)", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia (Federated States of)", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of Korea (South Korea)", "Republic of Moldova", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom of Great Britain and Northern Ireland", "United Republic of Tanzania", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]
  }
});

var UserSchema = new SimpleSchema({
    profile: {
        type: UserProfile,
        optional: true
    }
});

