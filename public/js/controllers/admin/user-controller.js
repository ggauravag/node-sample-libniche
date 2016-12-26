/**
 * Created by gaurav on 26/12/16.
 */
function userController($scope, UserService) {

    $scope.user = {};

    $scope.users = [];
    $scope.select = {};

    $scope.message = "";
    $scope.errMessage = "";

    $scope.errors = [];

    $scope.reset = function () {
        $scope.user = {};
        $scope.users = [];
        $scope.select = {};
    }

    $scope.addUser = function () {
        UserService.addUser($scope.user).then(function (response) {
           if(response.data.isSuccess) {
               $scope.message = "User Added successfully";
               $scope.reset();
               $scope.errMessage = "";
           } else {
               $scope.errMessage = response.data.message;
               $scope.errors = response.data.errors;
               $scope.message = "";
           }
        });
    }

    $scope.searchUsers = function () {
        console.log($scope.select.searchUsername);
        if ($scope.select.searchUsername !== "") {
            $scope.isLoading = true;
            UserService.searchUser($scope.select.searchUsername).then(function (response) {
                if (response.data.isSuccess) {
                    $scope.users = response.data.users;
                    if($scope.users.length === 0) {
                        $scope.errMessage = 'No user found with username ' + $scope.select.searchUsername;
                        $scope.message = "";
                    } else {
                        $scope.errMessage = "";
                        $scope.message = "";
                    }
                } else {
                    $scope.errMessage = response.data.message;
                    $scope.message = "";
                }
            }).then(function () {
                $scope.isLoading = false;
            });
        } else {
            $scope.reset();
            $scope.errMessage = '';
            $scope.message = "";
        }

    }

}

angular.module('libnicheApp').controller('UserController', userController);