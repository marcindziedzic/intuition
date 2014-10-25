import os.path

from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application, url

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "debug": True
}


class HelloHandler(RequestHandler):
    def get(self):
        self.write('Hello, world')



def make_app():
    return Application([
        url(r"/", HelloHandler)
    ], **settings)

if __name__ == '__main__':
    app = make_app()
    app.listen(8888)
    IOLoop.current().start()
