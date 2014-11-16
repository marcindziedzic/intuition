// use dynamic data binding if possible instead of direct cells manipulation
app.controller('BoardController', function ($scope, $http, $routeParams, $sessionStorage) {

    var colorScheme = [];

    $http.get('/defaults').success(function(data) {
        $scope.board_types = data.board_types;
        $scope.days_in_current_month = data.days_in_current_month;
        $scope.current_day = data.current_day;
        colorScheme = data.color_scheme;

        if ($routeParams.id) {
            $http.get('/board?id=' + $routeParams.id).success(function (data) {
                $scope.board = data;
            });
        } else {
            $scope.board = { };
            $scope.board.user_id = $sessionStorage.userId;
            $scope.board.cells = [];
            $scope.board.x_axis = _.range(1, $scope.days_in_current_month + 1);
            $scope.board.y_axis = ['comma','separated','list','of','activities'];
        }
    });

    $scope.getCellClasses = function (x, y) {
        var cell = _getCellFromBoard($scope.board.cells, x, y);
        if (cell != null) {
            return cell.val;
        }
        return 'neutral';
    };

    $scope.toggleColor = function(event) {
        _toggleColor(event.target.id);
    };

    var _getNewColorClass = function(currentColorClass, newColorClass) {
        if(typeof newColorClass !== typeof undefined) {
            var newClass = newColorClass;
        } else {
            var currentColorClassIndex = _.indexOf(colorScheme, currentColorClass);
            var nextColorClassIndex = currentColorClassIndex + 1;
            if (colorScheme.length == nextColorClassIndex) {
                nextColorClassIndex = 0;
            }
            var newClass = colorScheme[nextColorClassIndex];
        }

        return newClass;
    };

    var _toggleColor = function(elementId, newColor) {
        var currentColorClass = _getCurrentColorClass(elementId);
        var newColorClass = _getNewColorClass(currentColorClass, newColor);

        var el = document.getElementById(elementId);
        el.classList.remove(currentColorClass);
        el.classList.add(newColorClass);
    };

    var _getCurrentColorClass = function(element_id) {
        var el = document.getElementById(element_id);
        if (el == null) {
            return null;
        }
        return _getCurrentColorClassFromElement(el);
    };

    var _getCurrentColorClassFromElement = function (el) {
        var classes = el.classList;
        for (var i = 0; i < classes.length; i++) {
            var colorClass = classes[i];

            var _index_of = _.indexOf(colorScheme, colorClass);
            if (_index_of > -1) {
                return colorClass;
            }
        }
        return null;
    };

    var _getCellFromBoard = function(cells, x, y) {
        var idx = _getIndexOfCellInBoard(cells, x, y);
        if (idx > -1) {
            return cells[idx];
        }
        return null;
    };

    var _getIndexOfCellInBoard = function (cells, x, y) {
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell.x == x && cell.y == y) {
                return i;
            }
        }
        return -1;
    };

    var _readCells = function() {
        var cells = angular.element(document.querySelectorAll("td[data-cell]"));

        var _cells = [];
        angular.forEach(cells, function (cell, _) {
            var current_color = _getCurrentColorClass(cell.id);

            if (current_color != 'neutral') {
                var xy = cell.id.split('_');
                var x = xy[0];
                var y = xy[1];

                var _cell = {
                    'x': parseInt(x),
                    'y': parseInt(y),
                    'val': current_color
                };

                _cells.push(_cell);
            }
        });

        return _cells;
    };

    $scope.save = function(board) {
        board.cells = _readCells();

        $http.post('/board', board).success(function(data) {
            board._id = data.id;
        });
    }

});
