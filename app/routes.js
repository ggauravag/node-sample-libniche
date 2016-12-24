/**
 * Created by Gaurav on 24-12-2016.
 */
var userController = require('./controllers/user');
var adminController = require('./controllers/admin');
var bookController = require('./controllers/book');

var homeController = require('./controllers/home');

module.exports = function (server, auth) {
    server.post('/api/user', auth, userController.createUser);

    server.put('/api/admin/borrow-book', auth, adminController.borrowBook);
    server.put('/api/admin/return-book', auth, adminController.returnBook);

    server.post('/api/book', auth, bookController.addBook);
    server.delete('/api/book/:bookId', auth, bookController.deleteBook);

    server.get('*', homeController.renderHome);
}