app.controller('BoardController', function ($scope, $http, $routeParams, $sessionStorage, $modal, axis) {

    var commentsSupport = new CommentsSupport();
    var colorsSupport = new ColorsSupport();

    $http.get('/defaults').success(function(defaults) {
        $scope.board_types = defaults.board_types;
        $scope.days_in_current_month = defaults.days_in_current_month;
        $scope.current_day = defaults.current_day;

        if ($routeParams.id) {
            $http.get('/board?id=' + $routeParams.id).success(function (data) {
                $scope.board = data;

                $scope.x_axis = axis.transformIntoArray($scope.board.x_axis);
                $scope.y_axis = axis.transformIntoArray($scope.board.y_axis);

                colorsSupport.init(defaults.color_scheme, $scope.board.cells);
                commentsSupport.init($scope.board.cells);

                _watch();
            });
        } else {
            $scope.x_axis = _.range(1, $scope.days_in_current_month + 1);
            $scope.y_axis = ['comma','separated','list','of','activities'];

            $scope.board = { };
            $scope.board.user_id = $sessionStorage.userId;
            $scope.board.x_axis_id_seq = 0;
            $scope.board.y_axis_id_seq = 0;
            $scope.board.cells = [];

            $scope.board.x_axis = axis.transformIntoStruct($scope.x_axis, _nextXStruct);
            $scope.board.y_axis = axis.transformIntoStruct($scope.y_axis, _nextYStruct);

            colorsSupport.init(defaults.color_scheme, $scope.board.cells);

            _watch();
        }
    });

    var _watch = function () {
        $scope.$watchCollection("x_axis", function (newValue, oldValue) {
            axis.update(newValue, oldValue, $scope.board.x_axis, _nextXStruct);
        });
        $scope.$watchCollection("y_axis", function (newValue, oldValue) {
            axis.update(newValue, oldValue, $scope.board.y_axis, _nextYStruct);
        });
    };

    var _nextXStruct = function (val) {
        return axis.createStruct(val, function() {
            $scope.board.x_axis_id_seq++;
            return $scope.board.x_axis_id_seq;
        });
    };

    var _nextYStruct = function (val) {
        return axis.createStruct(val, function () {
            $scope.board.y_axis_id_seq++;
            return $scope.board.y_axis_id_seq;
        });
    };

    $scope.getCellClasses = colorsSupport.getByCords;

    $scope.toggleColor = function(event) {
        var elementId = event.target.id;

        var currentColorClass = colorsSupport.getById(elementId);
        colorsSupport.update(elementId, currentColorClass);
        var newColorClass = colorsSupport.getById(elementId);

        var el = document.getElementById(elementId);
        el.classList.remove(currentColorClass);
        el.classList.add(newColorClass);
    };

    var _readCells = function() {
        var cells = angular.element(document.querySelectorAll("td[data-cell]"));

        var _cells = [];
        angular.forEach(cells, function (cell, _) {
            var xy = cell.id.split('_');
            var x = xy[0];
            var y = xy[1];

            var current_color = colorsSupport.getByCords(x, y);

            if (current_color != 'neutral') {
                var _cell = {
                    'x': parseInt(x),
                    'y': parseInt(y)
                };

                colorsSupport.create(_cell);
                commentsSupport.create(_cell);

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
    };

    $scope.delete = function (board) {
        createModalWindow($modal,
            {
                controller: 'BoardRemovalController',
                notificationText: "Are you sure you want to delete '" + board.name + "'!",
                board: board
            }
        );
    };

    $scope.getComment = commentsSupport.getByCords;

    $scope.addComment = function(event) {
        var currentComment = commentsSupport.getById(event.target.id);

        createModalWindow($modal,
            {
                controller: 'SingleInputFieldModalController',
                notificationText: "Add a comment",
                showInputField: true,
                inputFieldText: currentComment,
                onSuccess: function (comment) {
                    commentsSupport.update(event.target.id, comment);
                }
            }
        );
    };
});

app.controller('BoardRemovalController', function ($scope, $modalInstance, $http, $location, params) {
    BaseModalController($scope, $modalInstance, params);

    $scope.ok = function () {
        $http.delete('/board?id=' + params['board']._id).success(function (data) {
            $modalInstance.close();
            $location.path('/dashboard');
        });
    };
});

function ColorsSupport() {

    var colorScheme = [];
    var colorsStore = {};

    function get(id) {
        var color = colorsStore[id];
        if (typeof color === typeof undefined) {
            return 'neutral';
        }
        return color;
    }

    return {

        init: function(_colorScheme, cells) {
            colorScheme = _colorScheme;

            angular.forEach(cells, function (cell, _) {
                colorsStore[cell.x + "_" + cell.y] = cell.val;
            });
        },

        create: function (cell) {
            var id = cell.x + '_' + cell.y;
            var color = colorsStore[id];
            if (!_.isUndefined(color)) {
                cell['val'] = color;
            }
        },

        getByCords: function(x, y) {
            var id = x + '_' + y;
            return get(id);
        },

        getById: get,

        update: function (id, currentColor) {
            var currentColorIndex = _.indexOf(colorScheme, currentColor);
            var nextColorIndex = currentColorIndex + 1;
            if (colorScheme.length == nextColorIndex) {
                nextColorIndex = 0;
            }
            var newClass = colorScheme[nextColorIndex];
            colorsStore[id] = newClass;
        }

    };

}

function CommentsSupport() {

    var commentsStore = {};

    return {

        init: function(cells) {
            angular.forEach(cells, function (cell, _) {
                if (!(typeof cell.comment === "undefined")) {
                    commentsStore[cell.x + "_" + cell.y] = cell.comment;
                }
            });
        },

        create: function (cell) {
            var id = cell.x + '_' + cell.y;
            var comment = commentsStore[id];
            if (!_.isUndefined(comment)) {
                cell['comment'] = comment;
            }
        },

        getByCords: function (x, y) {
            var id = x + '_' + y;
            return commentsStore[id];
        },

        getById: function (id) {
            var comment = commentsStore[id];
            if (_.isUndefined(comment)) {
                return null;
            }
            return comment;
        },

        update: function (id, comment) {
            if (!_.isEmpty(comment) && _.isString(comment)) {
                commentsStore[id] = comment;
            } else {
                delete commentsStore[id];
            }
        }

    };
}
