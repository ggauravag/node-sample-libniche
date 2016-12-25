/**
 * Created by Gaurav on 25-12-2016.
 */
function mainController(AuthService) {
    var self = this;

    self.authService = AuthService;
}

angular.module('libnicheApp').controller('MainController', mainController);
