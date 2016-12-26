/**
 * Created by Gaurav on 25-12-2016.
 */
function ajaxService($http) {
    var self = this;

    self.loginUser = function (data) {
        return $http({
            method: 'POST',
            url: '/api/login',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

}

function userService($http) {
    var self = this;

    self.searchUser = function (username) {
        return $http.get('/api/user/search?username=' + username);
    }

    self.addUser = function (user) {
        return $http.post('/api/user', user);
    }
}

function adminService($http) {
    var self = this;

    self.getTransactions = function () {
        return $http.get('/api/admin/transactions');
    }
}

function bookService($http) {
    var self = this;

    self.searchBooks = function (bookTitle) {
        return $http.get('/api/book/search?searchTitle=' + bookTitle);
    }

    self.borrowBook = function (bookDetails) {
        return $http.put('/api/admin/borrow-book', bookDetails);
    }

    self.returnBook = function (bookDetails) {
        return $http.put('/api/admin/return-book', bookDetails);
    }

    self.addBook = function (book) {
        return $http.post('/api/book', book);
    }

    self.deleteBook = function(bookId) {
        return $http.delete('/api/book/' + bookId);
    }
}

function authService($http) {
    var self = this;
    self.user = {};
    self.setUser = function (user) {
        self.user = angular.copy(user);
    }

    self.isAuthenticated = function () {
        return self.user && self.user.username;
    }

    self.logout = function () {
        delete self.user;
        self.user = {};
        return $http.post('/api/logout');
    }

    self.getUser = function () {
        return $http.get('/api/admin');
    }
}

angular.module('libnicheApp')
    .service('ajaxService', ajaxService)
    .service('AuthService', authService)
    .service('AdminService', adminService)
    .service('BookService', bookService)
    .service('UserService', userService);