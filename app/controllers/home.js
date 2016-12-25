/**
 * Created by Gaurav on 25-12-2016.
 */
var path = require('path');
var mongoose = require('mongoose');
var utils = require('../utils');

exports.renderHome = function (req, res) {
    res.sendFile(path.join(global.ROOT_DIR, 'public', 'views', 'index.html'));
}

exports.logoutUser = function (req, res) {
    req.session.destroy(function (err) {
        if (err)
            res.send({isSuccess: false});
        else
            res.send({isSuccess: true});
    });
}

exports.loginUser = function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    mongoose.model('AdminUser').findOne({username: username, password: password}, function (err, adminUser) {
        if (err)
            utils.handleError(err, res);
        else if (adminUser) {
            req.session.regenerate(function (err) {
                if (!err) {
                    req.session.user = adminUser;
                    req.session.user.password = undefined;
                    res.send({isSuccess: true});
                }
            });
        } else {
            res.send({isSuccess: false});
        }
    });

}