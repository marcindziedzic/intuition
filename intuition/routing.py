from tornado.web import url, StaticFileHandler

import intuition.handlers.board as h
import intuition.handlers.templates as t
import intuition.handlers.user as u


routes = [
    url(r"/boards", h.BoardsHandler),
    url(r"/board", h.BoardHandler),
    url(r"/board/links/expand", h.BoardLinksExpanderHandler),
    url(r"/template", t.TemplateHandler),
    url(r"/template/generators", t.TemplateGeneratorsHandler),
    url(r"/defaults", h.BoardDefaultsHandler),
    url(r"/events/sign_in", u.SignInHandler),
    url(r"/()$", StaticFileHandler, {'path': 'static/landing.html'}),
    url(r"/(.*)", StaticFileHandler, {'path': 'static/'}),
]
