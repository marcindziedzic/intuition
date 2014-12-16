function LinksSupport($http) {

    var linksStore = [];

    function excludeAlreadyLinkedBoards(boards, linkedWith) {
        var links = _.map(linkedWith, function (objIds) {
            return objIds.$oid;
        });
        return _.filter(boards, function (boardInfo) {
            return !_.contains(links, boardInfo._id.$oid);
        });
    }

    function excludeCurrentBoard(boards, currentBoard) {
        if (_.isUndefined(currentBoard._id)) {
            return boards;
        }
        return _.filter(boards, function (boardInfo) {
            return boardInfo._id.$oid != currentBoard._id.$oid;
        });
    }

    return {

        init: function (linkedWith) {
            if (!_.isUndefined(linkedWith)) {
                $http({
                    url: '/board/links/expand',
                    method: 'GET',
                    params: {'links': linkedWith}
                }).success(function (data) {
                    linksStore = data;
                });
            }
        },

        get: function() {
            return linksStore;
        },

        // filtering has to be done on client's side as client can have uncommitted changes
        getNotYetLinked: function (board, callback) {
            $http.get('/boards?user_id=' + board.user_id).success(function (data) {
                var notYetLinked = excludeAlreadyLinkedBoards(data, board.linked_with);
                notYetLinked = excludeCurrentBoard(notYetLinked, board);
                callback(notYetLinked);
            });
        },

        extend: function (board) {
            var linkedBoardsIds = _.map(linksStore, function(boardInfo) {
                return boardInfo._id;
            });
            board.linked_with = linkedBoardsIds;
        },

        update: function(boardInfo) {
            if (!_.isUndefined(boardInfo)) {
                linksStore.push(boardInfo);
            }
        }

    };
}
