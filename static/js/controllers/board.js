// use dynamic data binding if possible instead of direct cells manipulation
app.controller('BoardController', function ($scope, $http, $routeParams, $sessionStorage) {

    var colorScheme = [];

    $http.get('/defaults').success(function(data) {
        $scope.board_types = data.board_types;
        $scope.days_in_current_month = data.days_in_current_month;
        $scope.current_day = data.current_day;
        colorScheme = data.color_scheme;

        // TODO remove duplications
        if ($routeParams.id) {
            $http.get('/board?id=' + $routeParams.id).success(function (data) {
                $scope.board = data;

                $scope.x_axis = _extractVals($scope.board.x_axis);
                $scope.y_axis = _extractVals($scope.board.y_axis);

                watch();
            });
        } else {
            $scope.x_axis = _.range(1, $scope.days_in_current_month + 1);
            $scope.y_axis = ['comma','separated','list','of','activities'];

            $scope.board = { };
            $scope.board.user_id = $sessionStorage.userId;
            $scope.board.x_axis_id_seq = 0;
            $scope.board.y_axis_id_seq = 0;
            $scope.board.cells = [];

            $scope.board.x_axis = _transformIntoStruct($scope.x_axis, _nextXStruct);
            $scope.board.y_axis = _transformIntoStruct($scope.y_axis, _nextYStruct);

            watch();
        }
    });

    // TODO tmp space
    // TODO handle y watch
    // TODO cleanup
    // TODO add support for undefined (all removed, all added)
    // TODO write tests for this method
    var watch = function () {
        $scope.$watchCollection("x_axis", function (newValue, oldValue) {

            // detect change and push new hcell
            if (_.isUndefined(oldValue)) {
                return;
            }

            if (_.isUndefined(newValue)) {
                return;
            }

            // rename
            if (oldValue.length == newValue.length) {
                for (var i = 0; i < newValue.length; i++) {
                    var simple_x = newValue[i];
                    var complex_x = $scope.board.x_axis[i];

                    if (simple_x != complex_x.val) {
                        console.info('rename: ' + complex_x.val + " -> " + simple_x);
                        complex_x.val = simple_x;
                    }
                }
            }

            // element removed
            if (oldValue.length > newValue.length) {
                var notMatching = _.filter($scope.board.x_axis, function (complex) {
                    // TODO replace with _.contains
                    var contains = false;
                    for (var i = 0; i < newValue.length; i++) {
                        var simple = newValue[i];
                        if (complex.val == simple.toString()) {
                            contains = true;
                            break;
                        }
                    }
                    return contains == false;
                });

                for (var i = 0; i < notMatching.length; i++) {
                    var c = notMatching[i];

                    console.info('removing: ' + c.val);

                    var idx = $scope.board.x_axis.indexOf(c);
                    $scope.board.x_axis.splice(idx, 1);
                }
            }

            // element added
            if (newValue.length > oldValue.length) {

                for (var i = 0; i < newValue.length; i++) {
                    console.info('index: ' + i);

                    var simple_x = newValue[i];
                    var complex_x = $scope.board.x_axis[i];

                    if (_.isUndefined(complex_x)) {
                        var xhead = _nextXStruct(simple_x);
                        $scope.board.x_axis.splice(i, 0, xhead);
                    } else if (simple_x != complex_x.val) {
                        var xhead = _nextXStruct(simple_x);

                        // rename element in complex structure
                        console.info('replacing: ' + complex_x.val + ' -> ' + complex_x.val.replace(simple_x, ''));
                        var newVal = complex_x.val.replace(simple_x, '');
                        newVal = newVal.trim();

                        complex_x.val = newVal;

                        $scope.board.x_axis.splice(i, 0, xhead);
                    }
                }
            }

        });
    };

    var _extractVals = function (structs) {
        return _.map(structs, function(s) { return s.val; });
    };

    var _next = function(val , f) {
        return {
            'id': f(),
            'val': val
        };
    };

    var _nextXStruct = function (val) {
        return _next(val, function() {
            $scope.board.x_axis_id_seq++;
            return $scope.board.x_axis_id_seq;
        });
    };

    var _nextYStruct = function (val) {
        return _next(val, function () {
            $scope.board.y_axis_id_seq++;
            return $scope.board.y_axis_id_seq;
        });
    };

    var _transformIntoStruct = function (axis, createFn) {
        var seq = [];
        for (var i = 0; i < axis.length; i++) {
            var struct = createFn(axis[i]);
            seq.push(struct);
        }
        return seq;
    };

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
