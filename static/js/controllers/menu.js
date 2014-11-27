app.controller('MenuController', function ($scope, $rootScope, $sessionStorage, $location) {

    $scope.displayName = $sessionStorage.displayName;

    $rootScope.$on('user:loggedIn', function (event, data) {
        console.info('user logged in');
        $scope.displayName = data.displayName;
    });

    $scope.logout = function() {
        gapi.auth.signOut();
        $sessionStorage.$reset();

        $scope.displayName = null;

        $location.path('/login');
    };

});
