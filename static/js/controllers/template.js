app.controller('TemplateController', function ($scope, $http, $routeParams, $window, $location, usSpinnerService) {

    var userId = $window.sessionStorage.getItem('userId');

    $http.get('/template/generators').success(function(data) {
        $scope.generators = data;

        if ($routeParams.id) {
            /*$http.get('/board?id=' + $routeParams.id).success(function (data) {*/
		//// FIXME load template for edition and do something with data
            /*});*/
        } else {
            $scope.template = { };
            $scope.template.user_id = userId;
        }
    });

    $scope.save = function(template) {
        usSpinnerService.spin('commit-button-spinner');

	// FIXME Hack for clearning template params when axis generator changes
	// In the future we need more generic solution
	if (template.x_axis_generator !== 'Fixed set of fields') {
            template.x_axis_generator_params = null
	}

	if (template.y_axis_generator !== 'Fixed set of fields') {
            template.y_axis_generator_params = null
	}

        $http.post('/template', template).success(function(data) {
            usSpinnerService.stop('commit-button-spinner');
            $location.path("/boards/" + data.id);
        });
    };


});
