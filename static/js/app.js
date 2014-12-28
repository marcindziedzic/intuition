var app = angular.module('main', ["ngRoute", 'ui.bootstrap', 'angularSpinner']);

app.config(function ($routeProvider) {
    $routeProvider.
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
            redirectTo: "/dashboard"
        });
});
