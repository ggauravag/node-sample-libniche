/**
 * Created by Gaurav on 25-12-2016.
 */

function loginController($scope, ajaxService, AuthService, $state) {
    var self = this;

    $scope.user = {};
    $scope.user.username = "";
    $scope.user.password = "";
    $scope.user.invalidUser = false;

    $scope.isLoading = false;

    self.login = function () {
        var userLoginData = "username=" + $scope.user.username + "&password=" + $scope.user.password;

        ajaxService.loginUser(userLoginData).then(function (response) {
            if (response.data.isSuccess) {
                $scope.user.invalidUser = false;
                ajaxService.getUser().then(function (response) {
                    AuthService.setUser(response.data.user);
                    $state.go('book');
                });
            } else {
                $scope.user.invalidUser = true;
            }
        });
    }

    self.logout = function () {
        $scope.isLoading = true;
        AuthService.logout().then(function (response) {
            if (response.data.isSuccess) {
                self.message = "You have been logged out successfully";
            } else
                self.message = "Error while logging out ! Try logging in !";
        }).then(function () {
            $scope.isLoading = false;
        });
    }
}

angular.module('libnicheApp').controller('LoginController', loginController);