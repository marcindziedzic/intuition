from datetime import datetime

from bson.json_util import dumps, loads
from tornado.web import RequestHandler
from tornado import gen

from intuition.handlers.common import MongoAwareRequestHandler, \
    JsonAwareRequestHandler
from intuition.utils import days_in_current_month
from intuition.monitoring.keen import push_user_activity


BOARD_INFO_PROJECTION = {
    '_id': 1,
    'name': 1,
    'archived': 1,
    'when_modified': 1
}


class Board(object):

    @classmethod
    @gen.coroutine
    def get_by_user_id(cls, db, user_id):
        query = {'user_id': user_id}
        boards = yield Board.get_by_query(db, query)
        return boards

    @classmethod
    @gen.coroutine
    def get_by_query(cls, db, query):
        cursor = db.boards.find(query, BOARD_INFO_PROJECTION)
        boards = []
        while (yield cursor.fetch_next):
            q = cursor.next_object()
            boards.append(q)
        return boards


class BoardsHandler(MongoAwareRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        user_id = self.get_argument('user_id')
        boards = yield Board.get_by_user_id(self.db, user_id)
        self.write(dumps(boards))

    @gen.coroutine
    def delete(self, *args, **kwargs):
        user_id = self.get_argument('user_id')
        boards = yield Board.get_by_user_id(self.db, user_id)
        yield self.db.boards.remove({'user_id': user_id})
        for board in boards:
            push_user_activity('bulk board remove', user_id, 'board', board)
        self.write('ok')


class BoardHandler(MongoAwareRequestHandler, JsonAwareRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        board_id = self.get_id_as_mongo_object()
        board = yield self.db.boards.find_one(board_id)
        self._push_activity('board load', board)
        self.write(dumps(board))

    @gen.coroutine
    def post(self, *args, **kwargs):
        board = self.get_body_as_map()

        board['when_modified'] = datetime.utcnow()
        event_name = 'board update'
        if not board.get('_id'):
            board['when_created'] = board['when_modified']
            event_name = 'board creation'

        board_id = yield self.db.boards.save(board)
        board['_id'] = board_id

        self._push_activity(event_name, board)

        self.write({'id': str(board_id)})

    @gen.coroutine
    def delete(self, *args, **kwargs):
        board_id = self.get_id_as_mongo_object()
        board = yield self.db.boards.find_one(board_id)
        yield self.db.boards.remove({"_id": board_id})
        self._push_activity('board remove', board)
        self.write('ok')

    @staticmethod
    def _push_activity(name, board):
        push_user_activity(name, board['user_id'], 'board', board)


class BoardLinksExpanderHandler(MongoAwareRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        link_ids = self.get_arguments('links')
        mongo_link_ids = list(map(lambda l: loads(l), link_ids))
        query = {'_id': {'$in': mongo_link_ids}}
        boards = yield Board.get_by_query(self.db, query)
        self.write(dumps(boards))


class BoardDefaultsHandler(RequestHandler):
    # better use default colors instead of css classes, it's easier to replace
    # cache everything from this method
    def get(self, *args, **kwargs):
        from datetime import date
        current_day = date.today().day

        color_scheme = [
            'neutral',
            'great_success',
            'moderate_success',
            'weak_success',
            'weak_failure',
            'moderate_failure',
            'great_failure']

        d = {
            'board_templates': ['calendar'],
            'color_scheme': color_scheme,
            'days_in_current_month': days_in_current_month(),
            'current_day': current_day,
        }

        self.write(d)
