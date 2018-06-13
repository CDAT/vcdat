import pytest
import os
import sys
import os.path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir)))
from vcdat.app import app as flask_app
from vcdat.Files import isValidFile

# Declare Fixtures
#--------------------------------------------------------------------
@pytest.fixture(scope="module")
def app(request):
    flask_app.config["vcs_server"] = ""
    app = flask_app.test_client()
    app.testing = True
    return app

@pytest.fixture(scope="module")
def current_dir():
    return os.path.dirname(os.path.realpath(__file__))


# Test Status Codes
#--------------------------------------------------------------------
def test_home_status_code(app):
    result = app.get('/')
    assert result.status_code == 200

def test_invalid_resource_file(app):
    result = app.get('deps/' + 'taco.css')
    assert result.status_code == 404

def test_serve_resource_file_css(app):
    result = app.get('deps/' + 'Styles.css')
    assert result.status_code == 200

def test_serve_resource_file_js(app):
    result = app.get('deps/' + 'Bundle.js')
    assert result.status_code == 200

def test_file_tree_status_code(app):
    result = app.get('/getInitialFileTree')
    assert result.status_code == 200

def test_browse_files_status_code(app, current_dir):
    result = app.get('/browseFiles', query_string='path='+current_dir)
    assert result.status_code == 200

def test_load_variable_status_code(app):
    opendap = 'http://test.opendap.org/opendap/hyrax/data/nc/coads_climatology.nc'
    result = app.get('/loadVariablesFromFile', query_string='path='+opendap)
    assert result.status_code == 200


# Test Responses
#--------------------------------------------------------------------
def test_getTemplates(app):
    result = app.get('/getTemplates')
    assert result.data != "[]"

def test_browseFiles(app):
    folder = "emptyFolder"
    os.mkdir(folder)
    result = app.get('/browseFiles', query_string='path=' + folder)
    os.rmdir(folder)
    assert result.data != "[]"

# def test_browseFilesItems(app):
#     cur_dir_items = '{"directory": true, "path": "emptyFolder/", "sub_items": {"empty": ' + \
#                     '{"directory": false, "path": "emptyFolder/", "sub_items": {}, ' + \
#                     '"name": "empty"}}, "name": "emptyFolder"}'
#     folder = "emptyFolder"
#     os.mkdir(folder)
#     result = app.get('/browseFiles', query_string='path=' + folder)
#     os.rmdir(folder)
#     assert result.data == cur_dir_items

# Helper functions
#--------------------------------------------------------------------
def test_isValidFile_isTrue():
    _file = 'test_file.nc'
    open(_file, 'w').close()
    result = isValidFile('.', _file)
    os.remove(_file)
    assert result == True

def test_isValidFile_isFalse():
    _file = 'Templates.py'
    result = isValidFile('.', _file)
    assert result == False

