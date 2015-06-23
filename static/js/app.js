var app = angular.module('main', ["ngRoute", 'ui.bootstrap', 'angularSpinner']);

app.config(function ($routeProvider) {
    $routeProvider.
        when("/dashboard", {
            templateUrl: "templates/dashboard.html",
            controller: "DashboardController"
        }).
	when("/templates", {
            templateUrl: "templates/template.html",
            controller: "TemplateController"
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
