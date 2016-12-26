/**
 * Created by Gaurav on 25-12-2016.
 */
function bookController($scope, UserService, BookService) {
    $scope.books = [];

    $scope.searchTitle = "";
    $scope.isLoading = false;
    $scope.message = "";
    $scope.errMessage = "";

    $scope.book = {};

    $scope.bookDetails = {};

    $scope.users = [];
    $scope.username = "";

    $scope.errors = [];

    $scope.reset = function () {
        $scope.books = [];
        $scope.searchTitle = "";
        $scope.isLoading = false;
        $scope.book = {};
        $scope.bookDetails = {};
        $scope.users = [];
        $scope.username = "";
    }
    
    $scope.removeBook = function (book) {
        var bookId = book['_id'];
        BookService.deleteBook(bookId).then(function (response) {
            if(response.data.isSuccess) {
                $scope.reset();
                $scope.message = 'Book successfully deleted';
                $scope.errMessage = "";
            } else {
                $scope.errMessage = response.data.message;
                $scope.message = "";
                $scope.errors = response.data.errors;
            }
        });
    }

    $scope.addBook = function () {
        $scope.isLoading = true;
        BookService.addBook($scope.book).then(function (response) {
            if (response.data.isSuccess) {
                $scope.message = "Book Successfully Added";
                $scope.errMessage = "";
                $scope.reset();
            } else {
                $scope.errMessage = response.data.message;
                $scope.message = "";
                $scope.errors = response.data.errors;
            }
        }).then(function () {
            $scope.isLoading = false;
        });
    }

    $scope.searchBooks = function () {
        if ($scope.searchTitle !== "") {
            $scope.isLoading = true;
            BookService.searchBooks($scope.searchTitle).then(function (response) {
                if (response.data.isSuccess) {
                    $scope.books = response.data.books;
                    $scope.errMessage = '';
                    $scope.message = '';
                } else {
                    $scope.errMessage = response.data.message;
                    $scope.message = '';
                }
            }).then(function () {
                $scope.isLoading = false;
            });
        } else
            $scope.reset();
    }

    $scope.searchUser = function () {
        console.log($scope.username);
        if ($scope.username !== "") {
            $scope.isLoading = true;
            UserService.searchUser($scope.username).then(function (response) {
                if (response.data.isSuccess) {
                    $scope.users = response.data.users;
                } else {
                    $scope.message = response.data.message;
                }
            }).then(function () {
                $scope.isLoading = false;
            });
        } else {
            $scope.users = [];
        }
    }

    $scope.borrowBook = function () {
        $scope.isLoading = false;

        $scope.transaction = {};
        $scope.transaction.book = $scope.bookDetails.book['_id'];
        $scope.transaction.user = $scope.bookDetails.user['_id'];
        $scope.transaction.type = 'BORROW';
        $scope.transaction.due_date = $scope.bookDetails.due_date.getTime();

        BookService.borrowBook($scope.transaction).then(function (response) {
            $scope.isLoading = true;
            if (response.data.isSuccess) {
                $scope.message = "Book '"+ $scope.bookDetails.book['name'] +"' successfully borrowed";
                $scope.errMessage = '';
            } else {
                $scope.errMessage = response.data.message;
                $scope.message = '';
                $scope.errors = response.data.errors;
            }

            $scope.reset();
        });
    }

}

angular.module('libnicheApp').controller('BookController', bookController);