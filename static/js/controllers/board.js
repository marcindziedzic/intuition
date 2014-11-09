// use dynamic data binding if possible instead of direct cells manipulation
app.controller('BoardController', function ($scope, $http, $routeParams) {

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
            $scope.board.cells = [];
            $scope.board.x_axis = _.range(1, $scope.days_in_current_month + 1);
            $scope.board.y_axis = ['comma','separated','list','of','activities'];
        }
    });

    $scope.getCellClasses = function(x, y) {
        var cell = _getCellFromBoard($scope.board, x, y);
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

        el.setAttribute('data-cell-updated', 'true');
    };

    var _getCurrentColorClass = function(element_id) {
        var el = document.getElementById(element_id);
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

    var _getCellFromBoard = function(board, x, y) {
        var idx = _getIndexOfCellInBoard(board, x, y);
        if (idx > -1) {
            return board.cells[idx];
        }
        return null;
    };

    var _getIndexOfCellInBoard = function (board, x, y) {
        for (var i = 0; i < board.cells.length; i++) {
            var cell = board.cells[i];
            if (cell.x == x && cell.y == y) {
                return i;
            }
        }
        return -1;
    };

    var _createOrUpdateCellsInBoard = function(board) {
        var cells = angular.element(document.querySelectorAll("td[data-cell-updated]"));

        angular.forEach(cells, function (cell, _) {

            var current_color = _getCurrentColorClass(cell.id);

            var xy = cell.id.split('_');
            var x = xy[0];
            var y = xy[1];

            var _indexOfCell = _getIndexOfCellInBoard(board, x, y);
            if (_indexOfCell > -1) {
                // remove cell from board if exists
                board.cells.splice(_indexOfCell, 1);
            }

            // initialize and push new cell
            if (current_color != 'neutral') {
                var _cell = {
                    'x': x,
                    'y': y,
                    'val': current_color
                };

                board.cells.push(_cell)
            }

            cell.removeAttribute('data-cell-updated');

        });
    };

    $scope.save = function(board) {

        _createOrUpdateCellsInBoard(board);

        $http.post('/board', board).success(function(data) {
            board._id = data.id;
        });

    }

});
