/**
 * Created by Gaurav on 25-12-2016.
 */
var libnicheApp = angular.module('libnicheApp', ['ui.router']);

libnicheApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'LoginController as loginCtrl'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html',
            controller: 'AdminController as adminCtrl',
            authenticate: true
        })
        .state('user', {
            url: '/user',
            templateUrl: 'views/admin/user.html',
            controller: 'UserController as userCtrl',
            authenticate: true
        })
        .state('book', {
            url: '/book',
            templateUrl: 'views/admin/book.html',
            controller: 'BookController as bookCtrl',
            authenticate: true
        })
        .state('add-book', {
            url: '/book/add',
            templateUrl: 'views/admin/add-book.html',
            controller: 'BookController as bookCtrl',
            authenticate: true
        })
        .state('logout', {
            url: '/logout',
            templateUrl: 'views/login.html',
            controller: 'LoginController as loginCtrl'
        });

    $urlRouterProvider.otherwise('/login');
});

libnicheApp.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !AuthService.isAuthenticated()) {
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault();
        }
    });
});