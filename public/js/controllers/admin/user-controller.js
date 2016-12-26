/**
 * Created by gaurav on 26/12/16.
 */
function userController($scope, UserService) {

    $scope.user = {};

    $scope.users = [];
    $scope.select = {};

    $scope.message = "";
    $scope.errMessage = "";

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
           } else {
               $scope.errMessage = "Unable to add user";
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
                    } else
                        $scope.errMessage = "";
                } else {
                    $scope.message = "Error while searching for users";
                }
            }).then(function () {
                $scope.isLoading = false;
            });
        } else {
            $scope.reset();
            $scope.errMessage = '';
        }

    }

}

angular.module('libnicheApp').controller('UserController', userController);