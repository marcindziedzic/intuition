app.controller('MenuController', function ($scope, $rootScope, $location, $window) {

    $scope.displayName = $window.sessionStorage.getItem('displayName');

    $scope.logout = function() {
        gapi.auth.signOut();

        $window.sessionStorage.clear();
        $window.location.replace("landing.html");
    };

});
