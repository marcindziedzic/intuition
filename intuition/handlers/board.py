import json

from bson.objectid import ObjectId
from tornado.web import RequestHandler
from tornado import gen

from intuition.utils import days_in_current_month


class BoardHandler(RequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        db = self.settings['db']
        board_id = self.get_argument('id')
        board = yield db.boards.find_one(ObjectId(board_id))
        board['_id'] = str(board['_id'])
        self.set_header('Content-Type', 'application/javascript')
        self.write(board)

    @gen.coroutine
    def post(self, *args, **kwargs):
        board = json.loads(self.request.body.decode('utf-8'))

        if board.get('_id'):
            board['_id'] = ObjectId(board['_id'])

        db = self.settings['db']
        board_id = yield db.boards.save(board)
        self.write({'id': str(board_id)})


class BoardDefaultsHandler(RequestHandler):
    # better use default colors instead of css classes, it's easier to replace
    # cache everything from this method
    def get(self, *args, **kwargs):
        # colors = \
        # [
        # 'great_success',
        #         'moderate_success',
        #         'weak_success',
        #         'neutral',
        #         'weak_failure',
        #         'moderate_failure',
        #         'great_failure'
        #     ]

        d = {
            'board_types': ['calendar'],
            'days_in_current_month': days_in_current_month(),
        }

        self.write(d)
