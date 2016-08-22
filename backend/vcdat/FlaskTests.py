from app import app
import unittest
import os


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

    # Status Code Tests
    def test_home_status_code(self):
        result = self.app.get('/')
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
        dir_path = os.path.dirname(os.path.realpath(__file__))
        result = self.app.get('/browseFiles', query_string='path='+dir_path)
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
        cur_dir_items = '{"directory": true, "path": "emptyFolder/", "sub_items": {"empty": {"directory": false, "path": "emptyFolder/", "sub_items": {}, "name": "empty"}}, "name": "emptyFolder"}'
        folder = "emptyFolder"
        os.mkdir(folder)
        result = self.app.get('/browseFiles', query_string='path=' + folder)
        os.rmdir(folder)
        self.assertEqual(result.data, cur_dir_items)



# runs the unit tests in the module
if __name__ == '__main__':
    unittest.main()
