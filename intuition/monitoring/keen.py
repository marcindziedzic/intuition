import os

from keen.client import KeenClient
from tornado.ioloop import IOLoop


# unfortunately still using blocking IO
class AsyncKeenClient(object):
    def __init__(self):
        self._client = KeenClient(
            project_id=os.environ['KEEN_PROJECT_ID'],
            write_key=os.environ['KEEN_WRITE_KEY'],
            post_timeout=100
        )

    def add_event(self, collection, body):
        push = lambda: self._client.add_event(collection, body)
        IOLoop.current().spawn_callback(push)


class FakeKeenClient(object):
    def add_event(self, collection, body):
        print('keen.add_event ->', collection, body)


def push_user_activity(event, user_id, object_type, _object):
    if _object:
        client.add_event('user_activities', {
            'name': event,
            'user_id': user_id,
            'object_id': str(_object['_id']),
            'object_type': object_type
        })


if os.environ.get('KEEN_API_URL'):
    print('Connecting to prod Keen.io instance')
    client = AsyncKeenClient()
else:
    print('Connecting to fake keen.io instance')
    client = FakeKeenClient()
