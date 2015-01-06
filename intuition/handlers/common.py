from bson import ObjectId
from tornado.web import RequestHandler

from bson.json_util import loads, dumps


class JsonAwareRequestHandler(RequestHandler):

    def get_body_as_map(self):
        return loads(self.request.body.decode('utf-8'))

    def write_json(self, obj):
        self.write(dumps(obj))


class MongoAwareRequestHandler(RequestHandler):

    def prepare(self):
        self.db = self.settings['db']

    def get_id_as_mongo_object(self, arg='id'):
        return ObjectId(self.get_argument(arg))

    def get_args_as_mongo_object_ids(self, arg):
        pre_converted_ids = self.get_arguments(arg)
        return list(map(lambda l: loads(l), pre_converted_ids))


class RestApiRequestHandler(JsonAwareRequestHandler, MongoAwareRequestHandler):
    pass
