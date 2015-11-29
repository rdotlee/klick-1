Areas = new Mongo.Collection('Areas');
Schemas = {};
Schemas.Areas = new SimpleSchema({
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        },
        autoform: {
            omit: true
        }
    }
})

Areas.attachSchema(Schemas.Areas);

if (Meteor.isServer) {
    Areas.allow({
        insert : function (userId, doc) {
            if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
                return true;
            } else {
                return false;
            }
        },
        update : function (userId, doc) {
            if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
                return true;
            } else {
                return false;
            }
        },
        remove : function (userId, doc) {
            if(userId == doc._id || Roles.userIsInRole(userId, ['admin'])){
                return true;
            } else {
                return false;
            }
        }
    });
}
