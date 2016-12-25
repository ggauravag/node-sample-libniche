/**
 * Created by Gaurav on 24-12-2016.
 */
var mongoose = require('mongoose');
var utils = require('../utils');

exports.createUser = function(req, res) {
    var user = req.body;
    mongoose.model('User').create(user, function (err, savedUser) {
        if(err) {
            utils.handleError(err, res);
        } else {
            res.send({isSuccess: true, user: savedUser});
        }
    });
}

exports.searchUser = function(req,res) {
    var username = req.query.username;

    mongoose.model('User').find({username: new RegExp(username, 'i')}, function (err, users) {
       if(err)
           utils.handleError(err, res);
       else
           res.send({isSuccess: true, users: users});
    });
}