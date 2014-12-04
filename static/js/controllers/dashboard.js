app.controller('DashboardController', function ($scope, $http, $window, $modal) {

    var userId = $window.sessionStorage.getItem('userId');

    $http.get('/boards?user_id=' + userId).success(function(data) {
        $scope.boards = data;
    });

    $scope.getDateAgo = function(board) {
        if (typeof board.when_modified !== typeof undefined) {
            var date = new Date(board.when_modified.$date);
            var dateAgo = moment(date).fromNow();
            return dateAgo;
        }
        return '';
    };

    $scope.delete = function () {
        createModalWindow($modal,
            {
                controller: 'BoardsRemovalController',
                notificationText: "Are you sure you want to delete all boards! This can't be undone!",
                userId: userId,
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
