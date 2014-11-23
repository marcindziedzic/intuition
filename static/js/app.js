var app = angular.module('main', ["ngRoute", 'ngStorage', 'ui.bootstrap']);

app.config(function ($routeProvider) {
    $routeProvider.
        when("/login", {
            templateUrl: "templates/login.html",
            controller: "LoginController"
        }).
        when("/dashboard", {
            templateUrl: "templates/dashboard.html",
            controller: "DashboardController"
        }).
        when("/boards", {
            templateUrl: "templates/board.html",
            controller: "BoardController"
        }).
        when("/boards/:id", {
            templateUrl: "templates/board.html",
            controller: "BoardController"
        }).
        otherwise({
            redirectTo: "/login"
        });
});
