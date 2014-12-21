import os

from keen.client import KeenClient


if os.environ.get('KEEN_API_URL'):
    print('Connecting to prod Keen.io instance')
    # KeenClient uses synchronous http, it needs to be updated
    client = KeenClient(
        project_id=os.environ['KEEN_PROJECT_ID'],
        write_key=os.environ['KEEN_WRITE_KEY'],
        post_timeout=100
    )
else:
    print('Connecting to fake keen.io instance')

    class FakeKeenIOClient(object):

        def add_event(self, *args):
            print('keen.add_event ->', *args)

    client = FakeKeenIOClient()
