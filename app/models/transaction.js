/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
    due_date: {type: Date, required: true},
    type: {type: String, required: true}
});

TransactionSchema.path('book').validate(function (value, done) {
    mongoose.model('Book').findOne({_id: value}, function (err, book) {
        if (err || !book)
            done(false);
        else
            done(true);
    });
}, 'Requested book is not valid');


TransactionSchema.pre("save", function (next) {
    var self = this;
    mongoose.model('Book').findOne({_id: self.book}, function (err, book) {
        if (err) {
            next(err);
        } else if (book) {
            if (book.available && self.type === 'RETURN')
                next(new Error("Book is already returned, cannot process transaction"));
            else if (!book.available && self.type === 'BORROW')
                next(new Error('Book is not available currently to borrow'));
            else
                next();
        } else {
            next();
        }
    });
});


TransactionSchema.path('user').validate(function (value, done) {
    mongoose.model('User').findOne({_id: value}, function (err, user) {
        if (err || !user)
            done(false);
        else
            done(true);
    });
}, 'Requested user is not valid');

module.exports = mongoose.model('LibTransaction', TransactionSchema);