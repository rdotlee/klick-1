Meteor.methods({
    download_users: function() {
        var heading = true; // Optional, defaults to true
        var delimiter = "," // Optional, defaults to ",";
        var collection = Meteor.users.find().fetch();
        var output = collection.map(function(person){
            var output_person = {}

            output_person.id = person._id;
            output_person.email = person.emails[0].address;
            output_person.createdAt = person.createdAt;
            for (var key in Schemas.UserProfile._schema) {
                output_person["prof_"+key] = person.profile[key] || '';
            }
            output_person.klicks = person.klicks ? person.klicks.join(';') : '';
            output_person.canceledEvents = person.canceledEvents ? person.canceledEvents.join(';') : '';

            return output_person
        });

        return exportcsv.exportToCSV(output,heading,delimiter);
    }
});
