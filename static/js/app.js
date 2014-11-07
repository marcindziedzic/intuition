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

    // TODO move to utils
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    $http.get('/defaults').success(function(data) {
        $scope.board_types = data.board_types;
        $scope.days_in_current_month = data.days_in_current_month;

        if ($routeParams.id) {

            // TODO split services
            // TODO remove jquery
            // TODO clean code !!!
            // TODO write tests

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

    $scope.get_cell_classes = function(x, y) {
        for (i = 0; i < $scope.board.cells.length; i++) {
            var cell = $scope.board.cells[i];
            if (cell.x == x && cell.y == y) {
                return cell.val;
            }
        }

        return 'neutral';
    };



    // get available css classess from server
    availableCssClasses = ['neutral', 'great_success', 'moderate_success', 'weak_success', 'weak_failure', 'moderate_failure', 'great_failure'];

    // remove jquery from this file
    // in normal world this should give me predefined colour picker
    $scope.toggleColor = function(event) {

        _toggleColor(event.target.id);

    };

    // TODO refactor this function, use get_current_color
    var _toggleColor = function(element_id, new_color) {
        var el = $('#' + element_id);
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

                if(typeof new_color !== typeof undefined) {
                    if (_.indexOf(availableCssClasses, new_color) > -1) {
                        new_class = new_color;
                    }
                } else {
                    var _new_index = _index_of + 1;
                    if (availableCssClasses.length == _new_index) {
                        _new_index = 0;
                    }
                    var new_class = availableCssClasses[_new_index];
                }

                el.addClass(new_class);
                el.attr('data-cell', 'updated');
            }
        }
    };

    var _get_current_color = function(element_id) {
        var el = $('#' + element_id);
        var classess = el.attr('class').split(' ');

        for (var i = 0; i < classess.length; i++) {
            var current_color = classess[i];

            var _index_of = _.indexOf(availableCssClasses, current_color);
            if (_index_of > -1) {
                return current_color;
            }
        }

        return null;
    };

    var _indexOfCellByIdComponents = function(x, y) {
        for (var i = 0; i < $scope.board.cells.length; i++) {
            var cell = $scope.board.cells[i];
            if (cell.x == x && cell.y == y) {
                return i;
            }
        }
        return -1;
    }

    $scope.save = function(board) {
        var cells = angular.element(document.querySelectorAll("td[data-cell]"));

        angular.forEach(cells, function (cell, _) {

            var current_color = _get_current_color(cell.id);

            var xy = cell.id.split('_');
            var x = xy[0];
            var y = xy[1];

            var _indexOfCell = _indexOfCellByIdComponents(x, y);
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

        });

        $http.post('/board', board).success(function(data, status, headers, config) {
            board._id = data.id;
        });

    }

});
