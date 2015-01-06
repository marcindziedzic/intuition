from tornado import gen

from intuition.mongo import get_by_query


class Board(object):

    PROJECTION = {
        '_id': 1,
        'name': 1,
        'archived': 1,
        'when_modified': 1
    }

    @classmethod
    @gen.coroutine
    def get_by_id(cls, db, id):
        board = yield db.boards.find_one(id)
        return board

    @classmethod
    @gen.coroutine
    def get_by_user_id(cls, db, user_id):
        query = {'user_id': user_id}
        boards = yield Board.get_by_query(db, query)
        return boards

    @classmethod
    @gen.coroutine
    def get_by_query(cls, db, query):
        result = yield get_by_query(db.boards, query, cls.PROJECTION)
        return result

    @classmethod
    @gen.coroutine
    def save(cls, db, board):
        board_id = yield db.boards.save(board)
        board['_id'] = board_id
        return board

    @classmethod
    @gen.coroutine
    def remove(cls, db, board_id):
        board = yield Board.get_by_id(db, board_id)
        yield db.boards.remove({"_id": board_id})
        return board


class Template(object):

    @classmethod
    @gen.coroutine
    def get_templates_names(cls, db):
        templates = yield get_by_query(
            db.templates, projection={'_id': 0, 'name': 1})
        return [t['name'] for t in templates]

    @classmethod
    @gen.coroutine
    def get_by_name(cls, db, name):
        template = yield db.templates.find_one({'name': name})
        return template
