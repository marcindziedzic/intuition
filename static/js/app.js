var app = angular.module('main', ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider.
        when("/boards", {
            templateUrl: "templates/board.html",
            controller: "BoardController"
        }).
        when("/boards/:id", {
            templateUrl: "templates/board.html",
            controller: "BoardController"
        }).
        otherwise({
            redirectTo: "/boards"
        });
});


app.controller('BoardController', function ($scope, $http, $routeParams) {

    if ($routeParams.id) {
        // set this value to some considerable value, or remove it
        $scope.days_in_current_month = 31;

        // TODO load defaults
        // TODO initialize cells
        // TODO split services

        var board_id = $routeParams.id;
        console.warn('loading board:' + board_id);

        $http.get('/board?id=' + board_id).success(function (data) {
            console.warn('board loaded: ' + data);
            $scope.board = data;
        });

    } else {

        $http.get('/defaults').success(function(data) {
            $scope.board_types = data.board_types;
            $scope.days_in_current_month = data.days_in_current_month;

            $scope.board = { };
            $scope.board.x_axis = _.range(1, data.days_in_current_month + 1);
            $scope.board.y_axis = ['comma','separated','list','of','activities'];
        });

    }

    // get available css classess from server
    availableCssClasses = ['neutral', 'great_success', 'moderate_success', 'weak_success', 'weak_failure', 'moderate_failure', 'great_failure'];

    // remove jquery from this file
    // in normal world this should give me predefined colour picker
    $scope.toggleColor = function(event) {

        var el = $('#' + event.target.id);
        var classess = el.attr('class').split(' ');

        for (var i = 0; i < classess.length; i++) {
            var cssClass = classess[i];

            var _index_of = _.indexOf(availableCssClasses, cssClass);
            if (_index_of > -1) {


                var attr = el.attr('data-cell');
                if (typeof attr !== typeof undefined) {
                    el.removeAttr('data-cell');
                }

                el.removeClass(cssClass);

                // will fail at the end of the list
                var _new_index = _index_of + 1;
                if (availableCssClasses.length == _new_index) {
                    _new_index = 0;
                }
                var new_class = availableCssClasses[_new_index];

                el.addClass(new_class);
                el.attr('data-cell', new_class);
            }

        }

    };

    $scope.save = function(board) {
        board.cells = [];

        // filter neutrals here
        var cells = angular.element(document.querySelectorAll("td[data-cell]"));

        angular.forEach(cells, function (cell, _) {

            if (cell.attributes['data-cell'].value != 'neutral') {

                var xy = cell.id.split('_');

                var _cell = {
                    'x': xy[0],
                    'y': xy[1],
                    'val': cell.attributes['data-cell'].value
                };

                board.cells.push(_cell)
            }

        });

        $http.post('/board', board).success(function(data, status, headers, config) {
            board._id = data.id;
        });

    }

});
