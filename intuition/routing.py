from tornado.web import url
import intuition.handlers.board as h

routes = [
    url(r"/board", h.BoardHandler),
    url(r"/defaults", h.BoardDefaultsHandler),
]
