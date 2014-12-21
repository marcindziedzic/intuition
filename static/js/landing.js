var app = angular.module('landingPage', []);

app.controller('LoginController', function ($scope, $http, $location, $window) {

    $scope.signedIn = false;

    var _renderSignInButton = function () {
        gapi.signin.render('signInButton',
            {
                'callback': $scope.processAuth,
                'clientid': '220398280197-nv48tci6flnmtkff9i7g4430kejce25v.apps.googleusercontent.com',
                'scope': 'profile',
                'cookiepolicy': 'single_host_origin',
                'cookie_policy': 'single_host_origin'
            }
        );
    };

    $scope.processAuth = function (authResult) {
        if (authResult['g-oauth-window'] && authResult['access_token']) {
            gapi.auth.setToken(authResult);
            $scope.signedIn = true;
            _getUserInfo();
        } else {
            gapi.auth.signOut();
            $scope.signedIn = false;
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
        $http.post('/events/sign_in', userInfo).success(function(data) { });

        $window.sessionStorage.setItem('userId', userInfo.id);
        $window.sessionStorage.setItem('displayName', userInfo.displayName);
        $window.location.replace("/index.html#/dashboard");
    };

    _renderSignInButton();
});
