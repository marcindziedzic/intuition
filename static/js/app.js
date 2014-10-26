var app = angular.module('main', []);

app.controller('BoardController', function ($scope, $http) {

    $http.get('/defaults').success(function(data) {
        $scope.defaults = data
    });

    $scope.x_headers = []
    $scope.y_headers = ['klatka', 'plecy', 'ramiona', 'brzuch', 'nogi', 'biceps', 'triceps'];

    // get available css classess from server
    availableCssClasses = ['neutral', 'great_success', 'moderate_success', 'weak_success', 'weak_failure', 'moderate_failure', 'great_failure'];

    $scope.daysInCurrentMonth = function () {

        // Return today's date and time
        var currentTime = new Date()

        // returns the month (from 0 to 11)
        var month = currentTime.getMonth() + 1

        // returns the year (four digits)
        var year = currentTime.getFullYear()

        // returns number of days in month
        var days = new Date(year, month, 0).getDate();

        // TODO remove this logic from here
        $scope.x_headers =  _.range(1, days + 1);

        return  days;
    };

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
        board.x_axis = $scope.x_headers;
        board.y_axis = $scope.y_headers;
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
