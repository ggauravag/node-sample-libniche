/**
 * Created by Gaurav on 24-12-2016.
 */
var userController = require('./controllers/user');
var adminController = require('./controllers/admin');
var bookController = require('./controllers/book');

var homeController = require('./controllers/home');

module.exports = function (server, auth) {
    server.post('/api/user', auth, userController.createUser);
    server.get('/api/user/search', auth, userController.searchUser);

    server.post('/api/login', homeController.loginUser);
    server.post('/api/logout', auth, homeController.logoutUser);

    server.post('/api/admin/borrow-book', auth, adminController.borrowBook);
    server.put('/api/admin/return-book', auth, adminController.returnBook);
    server.get('/api/admin/transactions', auth, adminController.getTransactions);
    server.post('/api/admin', adminController.createAdmin);
    server.get('/api/admin', auth, adminController.getAdmin);


    server.post('/api/book', auth, bookController.addBook);
    server.get('/api/book/search', auth, bookController.getBooks);
    server.delete('/api/book/:bookId', auth, bookController.deleteBook);

    server.get('*', homeController.renderHome);
}