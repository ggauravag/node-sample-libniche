/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');
var utils = require('../utils')

exports.borrowBook = function (req, res) {
    var data = req.body;
    var bookId = data.bookId;
    var userId = data.userId;
    var due_date = data.due_date;

    if (!userId || !bookId) {
        res.send({isSuccess: false, message: "Book or user id missing"});
    } else {

        var borrowTx = {
            user: userId,
            book: bookId,
            due_date: due_date,
            type: 'BORROW'
        };

        mongoose.model('Transaction').create(borrowTx, function (err, savedTx) {
            if (err) {
                utils.handleError(err, res);
            } else {
                mongoose.model('Book').findOne({_id: savedTx.book}, function (err, book) {
                    if (err || !book) {
                        mongoose.model('Transaction').findByIdAndRemove(savedTx.id);
                        res.send({
                            isSuccess: false,
                            message: 'Unable to process transaction, try again !',
                            transaction: savedTx
                        });
                    } else {
                        book.available = false;
                        book.update();
                        res.send({isSuccess: true, transaction: savedTx});
                    }
                });
            }
        });
    }
}

exports.returnBook = function (req, res) {
    var data = req.body;
    var bookId = data.bookId;
    var userId = data.userId;

    if (!userId || !bookId) {
        res.send({isSuccess: false, message: "Book or user id missing"});
    } else {

        var returnTx = {
            user: userId,
            book: bookId,
            type: 'RETURN'
        };

        mongoose.model('Transaction').create(returnTx, function (err, savedTx) {
            if (err) {
                utils.handleError(err, res);
            } else {
                mongoose.model('Book').findOne({_id: savedTx.book}, function (err, book) {
                    if (err || !book) {
                        mongoose.model('Transaction').findByIdAndRemove(savedTx.id);
                        res.send({
                            isSuccess: false,
                            message: 'Unable to process transaction, try again !',
                            transaction: savedTx
                        });
                    } else {
                        book.available = true;
                        book.update();
                        res.send({isSuccess: true, transaction: savedTx});
                    }
                });
            }
        });
    }
}