import os
from collections import namedtuple

from tornado import gen


migrations = []

Migration = namedtuple('Migration', ['coll', 'instance', 'lookup_key'])


def connect_using(driver_cls):
    if os.environ.get('MONGOHQ_URL'):
        print('Connecting to prod mongodb using:', driver_cls.__name__)
        return driver_cls(os.environ['MONGOHQ_URL']).get_default_database()
    else:
        print('Connecting to local mongodb using:', driver_cls.__name__)
        return driver_cls().intuition


def register(coll, value, lookup_key):
    '''
     Registered objects are inserted into mongo using lookup_key. Such object
     has to be of type dict.
    '''
    if isinstance(value, list):
        for obj in value:
            m = Migration(coll=coll, instance=obj, lookup_key=lookup_key)
            migrations.append(m)
    else:
        raise ValueError('currently only list migrations are supported')


def migrate():
    print('Migrating mongo')
    import pymongo
    db = connect_using(pymongo.MongoClient)
    for migration in migrations:
        _apply(migration, db)
    db.connection.close()
    print('PyMongo connection closed')


def _apply(migration, db):
    collection = db[migration.coll]
    lookup_value = migration.instance[migration.lookup_key]

    query = {migration.lookup_key: lookup_value}
    doc = collection.find_one(query)
    if doc:
        migration.instance['_id'] = doc['_id']
    _id = collection.save(migration.instance)

    print('Doc', _id, 'saved into', migration.coll, ',lookup query', query)


@gen.coroutine
def get_by_query(coll, query={}, projection={}):
    cursor = coll.find(query, projection)
    result = []
    while (yield cursor.fetch_next):
        q = cursor.next_object()
        result.append(q)
    return result
