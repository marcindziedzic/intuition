from datetime import datetime

from tornado import gen

from intuition.model import Template
from intuition.board.templates import realize, get_generator_definitions
from intuition.handlers.common import RestApiRequestHandler
from intuition.monitoring.keen import push_user_activity


class TemplateHandler(RestApiRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        name = self.get_argument('name')
        template = yield Template.get_by_name(self.db, name)
        realized_template = realize(template)
        self.write_json(realized_template)

    # TODO eliminate duplication between 
    # TemplateHandler.post and BoardHandler.post - the same applies to
    # push_user_activity
    @gen.coroutine
    def post(self, *args, **kwargs):
        template = self.get_body_as_map()

        template['when_modified'] = datetime.utcnow()
        event_name = 'template update'
        if not template.get('_id'):
            template['when_created'] = template['when_modified']
            event_name = 'template creation'

        template = yield Template.save(self.db, template)

        self._push_activity(event_name, template)
        self.write_json({'id': str(template['_id'])})

    @staticmethod
    def _push_activity(name, template):
        push_user_activity(name, template['user_id'], 'template', template)


class TemplateGeneratorsHandler(RestApiRequestHandler):

    @gen.coroutine
    def get(self, *args, **kwargs):
        self.write_json(get_generator_definitions())

