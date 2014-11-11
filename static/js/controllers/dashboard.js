app.controller('DashboardController', function ($scope, $http, $routeParams) {

    $http.get('/boards?user_id=' + $routeParams.userId).success(function(data) {
        $scope.boards = data.boards;
    });

});
