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

        extend: function (cell) {
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
