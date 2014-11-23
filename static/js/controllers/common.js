// modal windows support
function BaseModalController($scope, $modalInstance, notificationText) {
    $scope.notificationText = notificationText;

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}

function createModalWindow($modal, params) {
    var resolve = {
        notificationText: function () {
            return params['notificationText'];
        },
        param: function () {
            return params['param'];
        }
    };

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
