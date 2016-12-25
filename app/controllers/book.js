/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');
var utils = require('../utils')

exports.addBook = function (req, res) {
    var book = req.body;
    book.available = true;
    mongoose.model('Book').create(book, function (err, savedBook) {
        if (err) {
            utils.handleError(err, res);
        } else {
            res.send({isSuccess: true, book: savedBook});
        }
    });
}

exports.getBooks = function (req, res) {
    var bookName = req.query.searchTitle;

    mongoose.model('Book').find({name : new RegExp(bookName, 'i')}, function (err, books) {
        if(err)
            utils.handleError(err, res);
        else
            res.send({isSuccess: true, books: books});
    })

}

exports.deleteBook = function (req, res) {
    var book = req.params.bookId;
    mongoose.model('Book').findByIdAndRemove(book, function (err, deletedBook) {
        if (err) {
            utils.handleError(err, res);
        } else if(deletedBook) {
            console.log('Book Deleted with id: ' + deletedBook.id);
            res.send({isSuccess: true});
        } else {
            res.send({isSuccess: false, message: "No book exists with given id"});
        }
    });
}