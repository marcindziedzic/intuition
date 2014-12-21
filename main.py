import os

import motor
from tornado.ioloop import IOLoop
from tornado.web import Application

from intuition.routing import routes


if os.environ.get('MONGOHQ_URL'):
    print('Connecting to prod mongo instance')
    db = motor.MotorClient(os.environ['MONGOHQ_URL']).get_default_database()
    debug = False
else:
    print('Connecting to local mongo instance')
    db = motor.MotorClient().intuition
    debug = True

settings = {
    "debug": debug,
    "db": db
}


def make_app():
    return Application(routes, **settings)


if __name__ == '__main__':
    http_port = os.environ.get('PORT', 8888)
    app = make_app()
    app.listen(http_port)
    IOLoop.current().start()
