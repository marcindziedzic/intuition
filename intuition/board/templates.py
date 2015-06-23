import calendar
import datetime


# generators
class CurrentMonthAxisGenerator(object):

    name = 'Current Month'
    args = ''

    def run(self, *args):
        now = datetime.datetime.now()
        _, days_in_month = calendar.monthrange(now.year, now.month)
        return range(1, days_in_month + 1)


class FixedSetOfFieldsAxisGenerator(object):

    name = 'Fixed set of fields'
    args = 'List of names'

    def run(self, fields):
        return fields


generators = [
    CurrentMonthAxisGenerator,
    FixedSetOfFieldsAxisGenerator,
]


def _get_generator_by_name(name):
    for cls in generators:
        if cls.name == name:
            return cls()


def get_generator_definitions():
    definitions = []
    for cls in generators:
        definitions.append({
            'name': cls.name,
            'args': cls.args,
        })
    return definitions


# templates
current_calendar_month_template = {
    'name': 'Current Calendar Month',
    'x_axis_generator': 'Current Month',
    'x_axis_generator_params': None,
    'y_axis_generator': 'Fixed set of fields',
    'y_axis_generator_params': ['comma', 'separated', 'list', 'of', 'activities'],
}

predefined_templates = [
    current_calendar_month_template,
]


# operations
def realize(template):
    x_axis_generator = _get_generator_by_name(template['x_axis_generator'])
    y_axis_generator = _get_generator_by_name(template['y_axis_generator'])
    x_axis = x_axis_generator.run(template.get('x_axis_generator_params'))
    y_axis = y_axis_generator.run(template.get('y_axis_generator_params'))
    return {
        'x_axis': x_axis,
        'y_axis': y_axis,
    }
