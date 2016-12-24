/**
 * Created by Gaurav on 24-12-2016.
 */
exports.handleError = function(err, res) {
    console.log('--- Error Code: %s, name: %s, message: %s ---', err.code, err.name, err.message);
    res.send({isSuccess: false, message: err.message, errors: err.errors});
}