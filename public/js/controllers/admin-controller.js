/**
 * Created by Gaurav on 25-12-2016.
 */
function adminController($scope, AdminService, BookService) {
    var self = this;

    $scope.isLoading = false;
    $scope.transactions = [];
    $scope.message = '';
    $scope.errMessage = '';
    
    $scope.reset = function () {
        
    }

    self.init = function () {
        $scope.isLoading = true;
        AdminService.getTransactions().then(function (response) {
            $scope.transactions = response.data.transactions;
        }).then(function () {
            $scope.isLoading = false;
        });
    }

    $scope.returnBook = function (transaction) {
        console.log('Book to be returned');
        console.info(transaction);

        var bookDetails = {
            book: transaction.book['_id'],
            user: transaction.user['_id'],
            type: 'RETURN'
        };

        BookService.returnBook(bookDetails).then(function (response) {
            if (response.data.isSuccess) {
                $scope.message = "Book '" + transaction.book['name'] + "' is returned by " + transaction.user['first_name'] + " successfully.";
                $scope.errMessage = '';
                $scope.reset();
                self.init();
            } else {
                $scope.errMessage = 'Unable to return the book';
                $scope.message = '';
            }
        });
    }

}

angular.module('libnicheApp').controller('AdminController', adminController);