import calendar
import datetime


# generators
def days_in_current_month_axis_generator():
    now = datetime.datetime.now()
    _, days_in_month = calendar.monthrange(now.year, now.month)
    return range(1, days_in_month + 1)


def constant_axis_generator():
    return ['comma', 'separated', 'list', 'of', 'activities']

# predefined templates
current_calendar_month_template = {
    'name': 'Current Calendar Month',
    'x_axis_generator': days_in_current_month_axis_generator,
    'y_axis_generator': constant_axis_generator,
}

predefined_templates = [
    current_calendar_month_template,
]

predefined_templates_names = [
    template['name'] for template in predefined_templates
]


# operations
def get_template_by_name(name):
    for template in predefined_templates:
        if template['name'] == name:
            return template
        return None


def realize(template):
    x_axis = template['x_axis_generator']()
    y_axis = template['y_axis_generator']()
    return {
        'name': template['name'],
        'x_axis': x_axis,
        'y_axis': y_axis,
    }
