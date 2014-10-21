# TODO cover with tests
def get_number_of_days_in_current_month():
    import calendar
    import datetime

    now = datetime.datetime.now()
    _, days_in_month = calendar.monthrange(now.year, now.month)

    return days_in_month