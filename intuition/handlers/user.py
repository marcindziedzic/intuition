import tornado
from tornado.ioloop import IOLoop

from intuition.handlers.common import JsonAwareRequestHandler

from intuition.monitoring.keen import client


class SignInHandler(JsonAwareRequestHandler):

    @tornado.web.asynchronous
    def post(self, *args, **kwargs):
        user_info = self.get_body_as_map()
        IOLoop.current().spawn_callback(self._push_event(user_info))
        self.finish()

    def _push_event(self, user_info):
        return lambda: client.add_event("sign_ins", {
            'user_id': user_info['id'],
            'username': user_info['displayName'],
            'language': user_info['language'],
            'source': 'google'})
