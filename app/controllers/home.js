/**
 * Created by Gaurav on 25-12-2016.
 */
var path = require('path');
var mongoose = require('mongoose');
var utils = require('../utils');

exports.renderHome = function (req, res) {
    res.sendFile(path.join(global.ROOT_DIR, 'public', 'views', 'index.html'));
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
                    delete req.session.user['password'];
                    res.send({isSuccess: true});
                }
            });
        } else {
            res.send({isSuccess: false});
        }
    });

}