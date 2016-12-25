/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');
var utils = require('../utils');

exports.createAdmin = function (req, res) {
    var adminUser = req.body;
    mongoose.model('AdminUser').create(adminUser, function (err, savedAdmin) {
        if (err)
            utils.handleError(err, res);
        else {
            res.send({isSuccess: true, admin: savedAdmin});
        }
    });
}

exports.getAdmin = function (req, res) {
    var adminUser = req.session.user;
    res.send({user: adminUser});
}

exports.getTransactions = function (req, res) {
    mongoose.model('Transaction').find({}).populate('user book').sort('-due_date').exec(function (err, transactions) {
        if (err)
            utils.handleError(err, res);
        else
            res.send({isSuccess: true, transactions: transactions});
    });
}

exports.borrowBook = function (req, res) {
    var data = req.body;
    var bookId = data.bookId;
    var userId = data.userId;
    var due_date = new Date(data.due_date);
    console.log('Request Received');
    if (!userId || !bookId) {
        res.send({isSuccess: false, message: "Book or user id missing"});
    } else {

        var borrowTx = {
            user: userId,
            book: bookId,
            due_date: due_date,
            type: 'BORROW'
        };
        console.log('created');
        mongoose.model('Transaction').create(borrowTx, function (err, savedTx) {
            if (err) {
                console.log('Error');
                utils.handleError(err, res);
            } else {
                console.log('Transaction created');
                mongoose.model('Book').findOne({_id: savedTx.book}, function (err, book) {
                    if (err || !book) {
                        console.log('No book');
                        mongoose.model('Transaction').findByIdAndRemove(savedTx.id);
                        res.send({
                            isSuccess: false,
                            message: 'Unable to process transaction, try again !',
                            transaction: savedTx
                        });
                    } else {
                        console.log('Request Received');
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