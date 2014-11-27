app.controller('LoginController', function ($scope, $location, $sessionStorage) {

    $scope.signedIn = false;

    var _renderSignInButton = function () {
        gapi.signin.render('signInButton',
            {
                'callback': $scope.processAuth,
                'clientid': '220398280197-nv48tci6flnmtkff9i7g4430kejce25v.apps.googleusercontent.com',
                'scope': 'profile',
                'cookiepolicy': 'single_host_origin'
            }
        );
    };

    $scope.processAuth = function (authResult) {
        if (authResult['access_token']) {
            $scope.signedIn = true;
            _getUserInfo();
        } else if (authResult['error']) {
            $scope.signedIn = false;
            // do sth useful with error
        }
    };

    var _getUserInfo = function () {
        gapi.client.request(
            {
                'path': '/plus/v1/people/me',
                'method': 'GET',
                'callback': _processUserInfo
            }
        );
    };

    var _processUserInfo = function (userInfo) {
        $sessionStorage.userId = userInfo.id;
        $sessionStorage.displayName = userInfo.displayName;

        $scope.$emit('user:loggedIn',
            {userId: userInfo.id, displayName: userInfo.displayName});

        $scope.$apply(function() { $location.path('/dashboard/'); });
    };

    _renderSignInButton();
});
