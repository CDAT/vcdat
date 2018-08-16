import unittest
import os 
import sys
import time

this_dir = os.path.abspath(os.path.dirname(__file__))
lib_dir = os.path.join(this_dir, '..', 'lib')
sys.path.append(lib_dir)

# from BaseTestCase import BaseTestCase
from BaseTestCase import BaseTestCase
from MainPage import MainPage
from AddVariable import AddVariableModal
from AddVariable import FileExplorerModal

class AddVariableTest(BaseTestCase):
    def testAddVariable(self):

        main_page = MainPage(self.driver)
        add_variable_pop_up = main_page.add_variable
        time.sleep(3)

        add_variable = AddVariableModal(self.driver)
        load_file_pop_up = add_variable.load_from_file
        time.sleep(3)

        file_explorer_pop_up = FileExplorerModal(self.driver)
        data_file = "/Users/muryanto1/work/vcdat/miniconda2/envs/vcdat/share/uvcdat/sample_data/clt.nc"
        tmp_ret_val = file_explorer_pop_up.load_a_sample_file(data_file)

if __name__ == '__main__':
    unittest.main(verbosity=2)

