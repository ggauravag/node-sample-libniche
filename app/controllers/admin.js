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
    mongoose.model('LibTransaction').find({}).populate('user book').sort('-due_date').exec(function (err, transactions) {
        if (err)
            utils.handleError(err, res);
        else
            res.send({isSuccess: true, transactions: transactions});
    });
}

exports.borrowBook = function (req, res) {
    var data = req.body;
    var bookId = data.book;
    var userId = data.user;
    data.due_date = new Date(data.due_date);

    if (!userId || !bookId) {
        res.send({isSuccess: false, message: "Book or user id missing"});
    } else {
        data.type = 'BORROW';

        mongoose.model('LibTransaction').create(data, function (err, savedTx) {
            if (err) {
                utils.handleError(err, res);
            } else {
                mongoose.model('Book').update({_id: savedTx.book}, {$set: {available: false}}, function (err, updatedBook) {
                    if (err)
                        utils.handleError(err, res);
                    else
                        res.send({isSuccess: true, transaction: savedTx});
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

        mongoose.model('LibTransaction').create(returnTx, function (err, savedTx) {
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