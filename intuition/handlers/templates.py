from tornado import gen

from intuition.model import Template
from intuition.board.templates import realize, get_generator_definitions
from intuition.handlers.common import RestApiRequestHandler
from intuition.handlers.common import CreateUpdateEntityHandler


class TemplateHandler(CreateUpdateEntityHandler):

    ENTITY_TYPE = Template

    @gen.coroutine
    def get(self, *args, **kwargs):
        name = self.get_argument('name')
        template = yield Template.get_by_name(self.db, name)
        realized_template = realize(template)
        self._push_activity('load', template)
        self.write_json(realized_template)


class TemplateGeneratorsHandler(RestApiRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        self.write_json(get_generator_definitions())

