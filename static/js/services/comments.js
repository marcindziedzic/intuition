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

        extend: function (cell) {
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
