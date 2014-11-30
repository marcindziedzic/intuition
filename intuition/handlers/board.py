import json

from bson.objectid import ObjectId
from tornado.web import RequestHandler
from tornado import gen

from intuition.utils import days_in_current_month


class MongoAwareRequestHandler(RequestHandler):

    def prepare(self):
        self.db = self.settings['db']

    def get_id_as_mongo_object(self, arg='id'):
        return ObjectId(self.get_argument(arg))


class BoardsHandler(MongoAwareRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        user_id = self.get_argument('user_id')

        projection = {'_id': 1, 'name': 1, 'archived': 1}
        cursor = self.db.boards.find({'user_id': user_id}, projection)

        boards = []
        while (yield cursor.fetch_next):
            q = cursor.next_object()
            q['_id'] = str(q['_id'])
            boards.append(q)

        self.write({'boards': boards})

    @gen.coroutine
    def delete(self, *args, **kwargs):
        user_id = self.get_argument('user_id')
        result = yield self.db.boards.remove({'user_id': user_id})
        self.write(result)


class BoardHandler(MongoAwareRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        board_id = self.get_id_as_mongo_object()
        board = yield self.db.boards.find_one(board_id)
        board['_id'] = str(board['_id'])
        self.write(board)

    @gen.coroutine
    def post(self, *args, **kwargs):
        board = json.loads(self.request.body.decode('utf-8'))

        if board.get('_id'):
            board['_id'] = ObjectId(board['_id'])

        board_id = yield self.db.boards.save(board)
        self.write({'id': str(board_id)})

    @gen.coroutine
    def delete(self, *args, **kwargs):
        board_id = self.get_id_as_mongo_object()
        result = yield self.db.boards.remove({"_id": board_id})
        self.write(result)


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
