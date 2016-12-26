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
            } else {
                $scope.errMessage = 'Unable to delete book';
            }
        });
    }

    $scope.addBook = function () {
        $scope.isLoading = true;
        BookService.addBook($scope.book).then(function (response) {
            if (response.data.isSuccess) {
                $scope.message = "Book Successfully Added";
            } else {
                $scope.errMessage = "Error while adding book";
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
                } else {
                    $scope.message = "Error while searching books";
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
                    $scope.message = "Error while searching for users";
                }
            }).then(function () {
                $scope.isLoading = false;
            });
        } else {
            $scope.reset();
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
            } else {
                $scope.errMessage = "Unable to borrow book !";
            }

            $scope.reset();
        });
    }

}

angular.module('libnicheApp').controller('BookController', bookController);