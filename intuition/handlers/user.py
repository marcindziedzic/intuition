import tornado

from intuition.handlers.common import JsonAwareRequestHandler

from intuition.monitoring.keen import client


class SignInHandler(JsonAwareRequestHandler):

    @tornado.web.asynchronous
    def post(self, *args, **kwargs):
        user_info = self.get_body_as_map()
        event = {
            'user_id': user_info['id'],
            'username': user_info['displayName'],
            'language': user_info['language'],
            'source': 'google'
        }
        client.add_event("sign_ins", event)
        self.finish()
