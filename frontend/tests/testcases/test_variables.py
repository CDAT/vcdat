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
from AddVariable import LoadVariableModal
from AddVariable import FileExplorerModal

class AddVariableTest(BaseTestCase):
    def testAddVariable(self):

        # click on the Variable + button on main page
        main_page = MainPage(self.driver)
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
        # TEMPORARY hard code
        data_file = "/Users/muryanto1/work/vcdat/miniconda2/envs/vcdat/share/uvcdat/sample_data/clt.nc"
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
        main_page.find_variable(just_nc_name)        
        
        var = load_variable.variable_name()
        print("xxx xxx var: {v}".format(v=var))

if __name__ == '__main__':
    unittest.main(verbosity=2)

