import os

import motor
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url

from intuition.handlers.board import BoardDefaultsHandler, BoardHandler


if os.environ.get('MONGOHQ_URL'):
    print('Connecting to mongo using: ', os.environ['MONGOHQ_URL'])
    db = motor.MotorClient(os.environ['MONGOHQ_URL']).intuition
else:
    print('Connecting to local mongo instance')
    db = motor.MotorClient().intuition

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "debug": True,
    "db": db
}


class HelloHandler(RequestHandler):
    def get(self):
        self.write('Hello, world')


def make_app():
    return Application([
        url(r"/", HelloHandler),
        url(r"/board", BoardHandler),
        url(r"/defaults", BoardDefaultsHandler),
    ], **settings)

if __name__ == '__main__':
    app = make_app()
    app.listen(8888)
    IOLoop.current().start()
