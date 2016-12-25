/**
 * Created by Gaurav on 25-12-2016.
 */
function adminController($scope, AdminService) {
    var self = this;

    $scope.isLoading = false;
    $scope.transactions = [];

    self.init = function() {
        $scope.isLoading = true;
        AdminService.getTransactions().then(function (response) {
            $scope.transactions = response.data.transactions;
        }).then(function () {
            $scope.isLoading = false;
        });
    }

}

angular.module('libnicheApp').controller('AdminController', adminController);