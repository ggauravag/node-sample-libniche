/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
    name: {type: mongoose.Schema.Types.String, required: true, unique: true, index: true},
    author: {type: mongoose.Schema.Types.String, required: true, index: true},
    available: {type: mongoose.Schema.Types.Boolean, required: true}
});

BookSchema.path('name').validate(function (value, done) {
    mongoose.model('Book').count({name: value}, function (error, count) {
        // Return false if an error is thrown or count > 0
        done(!(error || count));
    });
}, 'There is already a book with given name');

module.exports = mongoose.model('Book', BookSchema);