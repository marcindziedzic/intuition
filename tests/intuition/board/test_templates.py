from freezegun import freeze_time

from intuition.board.templates import predefined_templates, realize, \
    get_template_by_name
from intuition.board.templates import current_calendar_month_template


def test_there_is_only_one_predefined_template():
    assert len(predefined_templates) == 1
    assert predefined_templates[0] == current_calendar_month_template


def test_it_is_possible_to_get_template_by_name():
    template = get_template_by_name('Current Calendar Month')
    assert template == current_calendar_month_template


@freeze_time('2015-02-01')
def test_current_calendar_template():
    realized_template = realize(current_calendar_month_template)
    assert realized_template == {
        'x_axis': range(1, 29),
        'y_axis': ['comma', 'separated', 'list', 'of', 'activities'],
    }
