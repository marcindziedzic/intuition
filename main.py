import os

import motor
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application

from intuition.routing import routes


if os.environ.get('MONGOHQ_URL'):
    print('Connecting to mongo using: ', os.environ['MONGOHQ_URL'])
    db = motor.MotorClient(os.environ['MONGOHQ_URL']).db()
else:
    print('Connecting to local mongo instance')
    db = motor.MotorClient().intuition

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "debug": True,
    "db": db
}


def make_app():
    return Application(routes, **settings)


if __name__ == '__main__':
    http_port = os.environ.get('PORT', 8888)
    app = make_app()
    app.listen(http_port)
    IOLoop.current().start()
