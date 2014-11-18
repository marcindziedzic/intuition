#!/bin/bash

ENV_PATH=~/.virtualenvs/intuition

# setup mongodb

function setup_nodejs_and_npm() {
    sudo apt-add-repository ppa:chris-lea/node.js &&
    sudo apt-get update &&
    sudo apt-get install nodejs &&
    sudo npm install -g npm
}

function setup_python() {
    sudo apt-get install python3.4-dev
}

function setup_venv() {
    pyvenv-3.4 --without-pip ${ENV_PATH}
    source ${ENV_PATH}/bin/activate
    cd ${ENV_PATH}
    wget https://pypi.python.org/packages/source/s/setuptools/setuptools-3.4.4.tar.gz
    tar -vzxf setuptools-3.4.4.tar.gz
    cd setuptools-3.4.4
    python setup.py install
    cd ..
    wget https://pypi.python.org/packages/source/p/pip/pip-1.5.6.tar.gz
    tar -vzxf pip-1.5.6.tar.gz
    cd pip-1.5.6
    python setup.py install
}

setup_python
setup_venv
setup_nodejs_and_npm
