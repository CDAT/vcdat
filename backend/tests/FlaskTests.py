import unittest
import os
import sys
import os.path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))
from vcdat.app import app
from vcdat.Files import isValidFile


class FlaskTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        pass

    @classmethod
    def tearDownClass(cls):
        pass

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def tearDown(self):
        pass

    @staticmethod
    def getCurrentDir():
        return os.path.dirname(os.path.realpath(__file__))

    # Status Code Tests
    def test_home_status_code(self):
        result = self.app.get('/')
        self.assertEqual(result.status_code, 200)

    def test_serve_resource_file(self):
        result = self.app.get('deps/' + 'taco.css')
        self.assertEqual(result.status_code, 404)

    def test_serve_resource_file_css(self):
        result = self.app.get('deps/' + 'Styles.css')
        self.assertEqual(result.status_code, 200)

    def test_serve_resource_file_js(self):
        result = self.app.get('deps/' + 'Bundle.js')
        self.assertEqual(result.status_code, 200)

    def test_templates_status_code(self):
        result = self.app.get('/getTemplates')
        self.assertEqual(result.status_code, 200)

    def test_graphics_methods_status_code(self):
        result = self.app.get('/getGraphicsMethods')
        self.assertEqual(result.status_code, 200)

    def test_file_tree_status_code(self):
        result = self.app.get('/getInitialFileTree')
        self.assertEqual(result.status_code, 200)

    def test_browse_files_status_code(self):
        result = self.app.get('/browseFiles', query_string='path='+self.getCurrentDir())
        self.assertEqual(result.status_code, 200)

    def test_load_variable_status_code(self):
        opendap = 'http://test.opendap.org/opendap/hyrax/data/nc/coads_climatology.nc'
        result = self.app.get('/loadVariablesFromFile', query_string='path='+opendap)
        self.assertEqual(result.status_code, 200)

    # Returned Data Tests
    def test_getTemplates(self):
        result = self.app.get('/getTemplates')
        self.assertNotEqual(result.data, "[]")

    def test_browseFiles(self):
        folder = "emptyFolder"
        os.mkdir(folder)
        result = self.app.get('/browseFiles', query_string='path=' + folder)
        os.rmdir(folder)
        self.assertNotEqual(result.data, "[]")

    def test_browseFilesItems(self):
        cur_dir_items = '{"directory": true, "path": "emptyFolder/", "sub_items": {"empty": ' + \
                        '{"directory": false, "path": "emptyFolder/", "sub_items": {}, ' + \
                        '"name": "empty"}}, "name": "emptyFolder"}'
        folder = "emptyFolder"
        os.mkdir(folder)
        result = self.app.get('/browseFiles', query_string='path=' + folder)
        os.rmdir(folder)
        self.assertEqual(result.data, cur_dir_items)

    # Helper functions
    def test_isValidFile_isTrue(self):
        _file = 'test_file.nc'
        open(_file, 'w').close()
        result = isValidFile('.', _file)
        os.remove(_file)
        self.assertEqual(result, True)

    def test_isValidFile_isFalse(self):
        _file = 'Templates.py'
        result = isValidFile('.', _file)
        self.assertEqual(result, False)


# runs the unit tests in the module
if __name__ == '__main__':  # pragma: no cover
    unittest.main()
