app.controller('DashboardController', function ($scope, $http, $sessionStorage) {

    $http.get('/boards?user_id=' + $sessionStorage.userId).success(function(data) {
        $scope.boards = data.boards;
    });

});
