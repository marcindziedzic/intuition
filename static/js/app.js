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
    }

});