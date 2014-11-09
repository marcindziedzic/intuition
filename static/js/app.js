var app = angular.module('main', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider.
        when("/boards", {
            templateUrl: "templates/board.html",
            controller: "BoardController"
        }).
        when("/boards/:id", {
            templateUrl: "templates/board.html",
            controller: "BoardController"
        }).
        otherwise({
            redirectTo: "/boards"
        });
});
