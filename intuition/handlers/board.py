from tornado import gen

from intuition.handlers.common import RestApiRequestHandler
from intuition.handlers.common import CreateUpdateEntityHandler
from intuition.model import Board, Template
from intuition.monitoring.keen import push_user_activity


class BoardsHandler(RestApiRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        user_id = self.get_argument('user_id')
        boards = yield Board.get_by_user_id(self.db, user_id)
        self.write_json(boards)

    @gen.coroutine
    def delete(self, *args, **kwargs):
        user_id = self.get_argument('user_id')
        boards = yield Board.remove_by_user_id(self.db, user_id)
        for board in boards:
            push_user_activity('bulk board remove', user_id, 'board', board)
        self.write('ok')


class BoardHandler(CreateUpdateEntityHandler):

    ENTITY_TYPE = Board

    @gen.coroutine
    def get(self, *args, **kwargs):
        board_id = self.get_id_as_mongo_object()
        board = yield Board.get_by_id(self.db, board_id)
        self._push_activity('load', board)
        self.write_json(board)

    @gen.coroutine
    def delete(self, *args, **kwargs):
        board_id = self.get_id_as_mongo_object()
        board = yield Board.remove(self.db, board_id)
        self._push_activity('remove', board)
        self.write('ok')


class BoardLinksExpanderHandler(RestApiRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        mongo_link_ids = self.get_args_as_mongo_object_ids('links')
        query = {'_id': {'$in': mongo_link_ids}}
        boards = yield Board.get_by_query(self.db, query)
        self.write_json(boards)


class BoardDefaultsHandler(RestApiRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        from datetime import date
        color_scheme = [
            'neutral',
            'great_success',
            'moderate_success',
            'weak_success',
            'weak_failure',
            'moderate_failure',
            'great_failure']
        templates = yield Template.get_templates_names(self.db)
        d = {
            'board_templates': templates,
            'color_scheme': color_scheme,
            'current_day': date.today().day,
        }
        self.write_json(d)

