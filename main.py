import os

import motor
from tornado.ioloop import IOLoop
from tornado.web import Application

from intuition.routing import routes
from intuition import mongo


def is_debug_on():
    debug_on = os.environ.get('MONGOHQ_URL') is None
    print('Starting app in debug mode:', debug_on)
    return debug_on


def migrate():
    from intuition.board.templates import predefined_templates

    mongo.register('templates', predefined_templates, lookup_key='name')
    mongo.migrate()


def make_app():
    db = mongo.connect_using(motor.MotorClient)
    settings = {
        "db": db,
        "debug": is_debug_on()
    }
    return Application(routes, **settings)


def run(app):
    http_port = os.environ.get('PORT', 8888)
    app.listen(http_port)
    IOLoop.current().start()


if __name__ == '__main__':
    migrate()
    app = make_app()
    run(app)
