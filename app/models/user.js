/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, max: 100},
    contact_number: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true, index: true}
});

UserSchema.path('username').validate(function (value, done) {
    mongoose.model('User').count({username: value}, function (error, count) {
        // Return false if an error is thrown or count > 0
        done(!(error || count));
    });
}, 'Username is already associated with a user');

UserSchema.path('email').validate(function (value, done) {
    mongoose.model('User').count({email: value}, function (error, count) {
        // Return false if an error is thrown or count > 0
        done(!(error || count));
    });
}, 'Email is already associated with a user');

UserSchema.path('contact_number').validate(function (value, done) {
    mongoose.model('User').count({contact_number: value}, function (error, count) {
        // Return false if an error is thrown or count > 0
        done(!(error || count));
    });
}, 'Contact Number is already associated with a user');

module.exports = mongoose.model('User', UserSchema);