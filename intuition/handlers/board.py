from tornado.web import RequestHandler


class BoardHandler(RequestHandler):
    pass


class BoardDefaultsHandler(RequestHandler):

    # better use default colors instead of css classess
    def get(self, *args, **kwargs):
        colors = \
            [
                'great_success',
                'moderate_success',
                'weak_success',
                'neutral',
                'weak_failure',
                'moderate_failure',
                'great_failure'
            ]
        return colors

