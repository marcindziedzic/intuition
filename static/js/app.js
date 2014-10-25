var app = angular.module('main', []);

app.controller('BoardController', function ($scope) {

    $scope.x_headers = []
    $scope.y_headers = ['klatka', 'plecy', 'ramiona', 'brzuch', 'nogi', 'biceps', 'triceps']

    $scope.boardTypes = ['calendar']

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

    // in normal world this should give me predefined colour picker
    $scope.toggleColour = function(event) {
        // get available css classess from server
        var availableCssClasses = ['great_success', 'moderate_success', 'weak_success', 'neutral', 'weak_failure', 'moderate_failure', 'great_failure' ]

        var el = $('#' + event.target.id);
        var classess = el.attr('class').split(' ');

        for (var i = 0; i < classess.length; i++) {
            var cssClass = classess[i];

            var _index_of = _.indexOf(availableCssClasses, cssClass);
            if (_index_of > -1) {

                el.removeClass(cssClass);

                // will fail at the end of the list
                var _new_index = _index_of + 1;
                if (availableCssClasses.length == _new_index) {
                    _new_index = 0;
                }

                el.addClass(availableCssClasses[_new_index]);
            }

        }

    };

});