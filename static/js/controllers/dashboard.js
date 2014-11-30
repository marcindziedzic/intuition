app.controller('DashboardController', function ($scope, $http, $sessionStorage, $modal) {

    $http.get('/boards?user_id=' + $sessionStorage.userId).success(function(data) {
        $scope.boards = data.boards;
    });

    $scope.delete = function () {
        createModalWindow($modal,
            {
                controller: 'BoardsRemovalController',
                notificationText: "Are you sure you want to delete all boards! This can't be undone!",
                userId: $sessionStorage.userId,
                onSuccess: function () {
                    $scope.boards = [];
                }
            }
        );
    };

});

app.controller('BoardsRemovalController', function ($scope, $modalInstance, $http, params) {
    BaseModalController($scope, $modalInstance, params);

    $scope.ok = function () {
        $http.delete('/boards?user_id=' + params['userId']).success(function (data) {
            $modalInstance.close();
        });
    };
});
