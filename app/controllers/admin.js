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
    mongoose.model('LibTransaction').find({}).populate('user book').sort('-date').exec(function (err, transactions) {
        if (err)
            utils.handleError(err, res);
        else {
            var results = [];
            for (var i = 0; i < transactions.length; i++) {
                if (transactions[i].type === 'BORROW') {
                    var borrowTx = transactions[i];
                    var returnTxs = transactions.filter(function (o) {
                        return o.book['_id'] === borrowTx.book['_id'] && o.user['_id'] === borrowTx.user['_id'] && o.type === 'RETURN';
                    });

                    var isNonReturned = true;
                    for (var j = 0; j < returnTxs.length; j++) {
                        if (returnTxs[j].date > borrowTx.date) {
                            isNonReturned = false;
                        }
                    }

                    var tx = JSON.parse(JSON.stringify(transactions[i]));
                    tx.isNonReturned = isNonReturned;

                    results.push(tx);
                } else
                    results.push(transactions[i]);
            }

            res.send({isSuccess: true, transactions: results});
        }

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
    var bookId = data.book;
    var userId = data.user;

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
                mongoose.model('Book').update({_id: savedTx.book}, {$set: {available: true}}, function (err, updatedBook) {
                    if (err)
                        utils.handleError(err, res);
                    else
                        res.send({isSuccess: true, transaction: savedTx});
                });
            }
        });
    }
}