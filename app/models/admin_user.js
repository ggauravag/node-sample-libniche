/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');

var AdminUserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, max: 100},
    contact_number: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);