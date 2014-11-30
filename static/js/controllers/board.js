app.controller('BoardController', function ($scope, $http, $routeParams, $sessionStorage, $modal, $location, axis) {

    var comments = new CommentsSupport();
    var colors = new ColorsSupport();

    $http.get('/defaults').success(function(defaults) {
        $scope.board_templates = defaults.board_templates;
        $scope.current_day = defaults.current_day;

        if ($routeParams.id) {
            $http.get('/board?id=' + $routeParams.id).success(function (data) {
                $scope.board = data;

                $scope.x_axis = axis.transformIntoArray($scope.board.x_axis);
                $scope.y_axis = axis.transformIntoArray($scope.board.y_axis);

                colors.init(defaults.color_scheme, $scope.board.cells);
                comments.init($scope.board.cells);

                _watch();
            });
        } else {
            $scope.x_axis = _.range(1, defaults.days_in_current_month + 1);
            $scope.y_axis = ['comma','separated','list','of','activities'];

            $scope.board = { };
            $scope.board.user_id = $sessionStorage.userId;
            $scope.board.x_axis_id_seq = 0;
            $scope.board.y_axis_id_seq = 0;
            $scope.board.cells = [];

            $scope.board.x_axis = axis.transformIntoStruct($scope.x_axis, _nextXStruct);
            $scope.board.y_axis = axis.transformIntoStruct($scope.y_axis, _nextYStruct);

            colors.init(defaults.color_scheme, $scope.board.cells);

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

    $scope.getCellClasses = colors.getByCords;

    $scope.toggleColor = function(event) {
        var elementId = event.target.id;

        var currentColorClass = colors.getById(elementId);
        colors.update(elementId, currentColorClass);
        var newColorClass = colors.getById(elementId);

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

            var current_color = colors.getByCords(x, y);

            if (current_color != 'neutral') {
                var _cell = {
                    'x': parseInt(x),
                    'y': parseInt(y)
                };

                colors.extend(_cell);
                comments.extend(_cell);

                _cells.push(_cell);
            }
        });

        return _cells;
    };

    $scope.save = function(board) {
        board.cells = _readCells();

        $http.post('/board', board).success(function(data) {
            board._id = data.id;
            $location.path("/boards/" + data.id);
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

    $scope.getComment = comments.getByCords;

    $scope.addComment = function(event) {
        var currentComment = comments.getById(event.target.id);

        createModalWindow($modal,
            {
                controller: 'SingleInputFieldModalController',
                notificationText: "Add a comment",
                showInputField: true,
                inputFieldText: currentComment,
                onSuccess: function (comment) {
                    comments.update(event.target.id, comment);
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
