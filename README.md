# Intuition setup

## Bootstraping development environment
1. Install one of the flavours of Ubuntu 14.04 
2. Run setup script to boost dev env for the first time (the assumption is that you don't have Python3.4, MongoDB, NodeJS, NPM. In case you have one of those components already installed comment appropriate function at the end of file.
```
cd bin
chmod +x setup_dev_env.sh
./setup_dev_env.sh
```
When asked for root password, insert it.

## Running application 
From application root run
```
➜  intuition git:(master) ✗ pwd
/home/marcin/workspace/intuition
➜  intuition git:(master) ✗ workon intuition 
(intuition) ➜  intuition git:(master) ✗ python main.py 
Connecting to fake keen.io instance
Migrating mongo
Connecting to local mongodb using: MongoClient
Doc 54abac193df5b126f2ce3174 saved into templates ,lookup query {'name': 'Current Calendar Month'}
PyMongo connection closed
Connecting to local mongodb using: MotorClient
Starting app in debug mode: True
```
Open http://localhost:8888 and have fun

## Running tests
Intuition uses PyTest for Python and Karma / Jasmine for JS testing
```
(intuition) ➜  intuition git:(master) ✗ pwd
/home/marcin/workspace/intuition
(intuition) ➜  intuition git:(master) ✗ py.test
===================================================================== test session starts =====================================================================
platform linux -- Python 3.4.0 -- py-1.4.26 -- pytest-2.6.4
plugins: xdist
collected 4 items 

node_modules/karma/node_modules/connect/node_modules/multiparty/node_modules/stream-counter/test/test.txt .
node_modules/karma/node_modules/socket.io/node_modules/socket.io-client/node_modules/xmlhttprequest/tests/testdata.txt .
tests/intuition/board/test_templates.py ..

================================================================== 4 passed in 3.55 seconds ===================================================================
```
and JS
```
cd bin
./karma start
```

