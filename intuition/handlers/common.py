from bson import ObjectId
from tornado.web import RequestHandler

from bson.json_util import loads


class JsonAwareRequestHandler(RequestHandler):

    def get_body_as_map(self):
        return loads(self.request.body.decode('utf-8'))


class MongoAwareRequestHandler(RequestHandler):

    def prepare(self):
        self.db = self.settings['db']

    def get_id_as_mongo_object(self, arg='id'):
        return ObjectId(self.get_argument(arg))
