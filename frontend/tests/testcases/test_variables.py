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
from Variable import LoadVariableModal
from Variable import FileExplorerModal

class variableTest(BaseTestCase):

    def _add_variable(self, main_page, data_file):
        main_page.add_variable()
        time.sleep(3)

        # verify that we have "Load Variable" pop up
        load_variable = LoadVariableModal(self.driver)

        # click on the file icon in the File row on "Load Variable" pop up
        load_variable.load_from_file()
        time.sleep(3)

        # verify that we have "File Explorer" pop up
        file_explorer_pop_up = FileExplorerModal(self.driver)

        # find the data file on the "File Explorer" pop up.
        file_explorer_pop_up.load_a_sample_file(data_file)

        # verify the selected file on the "Load Variable" pop up
        load_variable = LoadVariableModal(self.driver)
        selected_file_name = load_variable.selected_file
        err_msg = "Selected file name is not {n}".format(n=data_file)
        self.assertEqual(selected_file_name, data_file, err_msg)

        # click on the Load button on the "Load Variable" pop up
        load_variable.do_load_file()

        # alert_element = self.driver.find_element_by_xpath('//div[@role="alert"]').text.strip()
        # assert(alert_element.startswith("Successfully Loaded"))
        main_page.wait_till_file_loaded()

        # confirm that the data file name is listed on the left Variables panel
        nc_name = os.path.basename(data_file)
        just_nc_name = os.path.splitext(nc_name)[0]
        print("xxx DEBUG xxx...just_nc_name: {}".format(just_nc_name))
        main_page.find_variable(just_nc_name)        
        
        # REVISIT --- variable the value listed in the "Variable(s) text box
        var = load_variable.variable_name()
        print("xxx xxx var: {v}".format(v=var))

        # click on "Close" button on the Load Variable pop-up
        load_variable.close()
        print("...sleep 2 seconds")
        time.sleep(2)

    def _remove_variable(self, main_page, var_name):
        print("xxx delete_variable, var_name: {}".format(var_name))
        main_page.delete_variable(var_name)
        print("...sleep for 5 seconds...")
        time.sleep(5)

    def testAddVariable(self):
        # click on the Variable + button on main page
        main_page = MainPage(self.driver)

        # TEMPORARY hard code
        data_file = "/Users/muryanto1/work/vcdat/miniconda2/envs/vcdat/share/uvcdat/sample_data/clt.nc"
        self._add_variable(main_page, data_file)

        # TEMPORARY
        var_name = 'clt'
        self._remove_variable(main_page, var_name)

if __name__ == '__main__':
    unittest.main(verbosity=2)

