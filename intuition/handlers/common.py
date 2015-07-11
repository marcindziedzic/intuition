from datetime import datetime

from bson import ObjectId
from bson.json_util import loads, dumps
from tornado import gen
from tornado.web import RequestHandler

from intuition.monitoring.keen import push_user_activity


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


# TODO write tests for this component
class CreateUpdateEntityHandler(RestApiRequestHandler):

    ENTITY_TYPE = NotImplemented

    @gen.coroutine
    def post(self, *args, **kwargs):
        entity = self.get_body_as_map()
        event_name = 'update' if entity.get('_id') else 'creation'

        entity['when_modified'] = datetime.utcnow()
        if not entity.get('_id'):
            entity['when_created'] = entity['when_modified']

        entity = yield self.ENTITY_TYPE.save(self.db, entity)

        self._push_activity(event_name, entity)
        self.write_json({'id': str(entity['_id'])})

    def _push_activity(self, name, entity):
        entity_name = self.ENTITY_TYPE.__name__.lower()
        event_name = entity_name + ' ' + name
        push_user_activity(
            event_name, entity.get('user_id'), entity_name, entity)

