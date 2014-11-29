// modal windows support
function BaseModalController($scope, $modalInstance, params) {
    $scope.notificationText = params['notificationText'];

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}

app.controller('SingleInputFieldModalController', function ($scope, $modalInstance, params) {
    BaseModalController($scope, $modalInstance, params);

    $scope.showInputField = params['showInputField'];
    $scope.inputFieldText = params['inputFieldText'];

    $scope.ok = function () {
        $modalInstance.close($scope.inputFieldText);
    };
});

function createModalWindow($modal, params) {
    var resolveParams = {};
    for (var key in params) {
        if (key == 'onSuccess' || key == 'controller') {
            continue;
        }
        resolveParams[key] = params[key];
    }

    var resolve = { params: function () {
        return resolveParams;
    }};

    var modalInstance = $modal.open({
        templateUrl: 'yesNoModalTemplate.html',
        controller: params['controller'],
        size: 'lg',
        resolve: resolve
    });

    var onSuccess = params['onSuccess'];
    if (!_.isUndefined(onSuccess)) {
        modalInstance.result.then(onSuccess);
    }
}

// directives http://jsfiddle.net/bcaudan/vTZZ5/
app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
