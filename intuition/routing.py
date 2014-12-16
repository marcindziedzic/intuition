from tornado.web import url, StaticFileHandler

import intuition.handlers.board as h


routes = [
    url(r"/boards", h.BoardsHandler),
    url(r"/board", h.BoardHandler),
    url(r"/board/links/expand", h.BoardLinksExpanderHandler),
    url(r"/defaults", h.BoardDefaultsHandler),
    url(r"/()$", StaticFileHandler, {'path': 'static/landing.html'}),
    url(r"/(.*)", StaticFileHandler, {'path': 'static/'}),
]
