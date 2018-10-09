import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from BasePage import BasePage
from BasePage import InvalidPageException

class LoadVariableModal(BasePage):
    # "Load Variable" pop up

    # _file_explorer_locator = "btn-primary"
    _file_explorer_pop_up_locator = "//h4[text() = 'File Explorer']"
    _selected_file_locator = '//div[@class="load-from"]//span[@class="input-group input-group-sm"]//input'
    _file_button_locator = '//div[@class="load-from"]//span[@class="input-group-btn"]//button[@class="btn btn-primary"]'

    _load_button_locator = '//div[@class="modal-footer"]//button[@class="btn btn-primary" and text() = "Load"]'
    _close_button_locator = '//div[@class="modal-footer"]//button[@class="btn btn-default" and text() = "Close"]'

    _variable_name_opts_locator = '//optgroup[@label="---Variables---"]//option'

    def __init__(self, driver):
        super(LoadVariableModal, self).__init__(driver)

    def _validate_page(self, driver):
        title = driver.find_element_by_class_name("modal-title").text.strip()
        if "Load Variable" in title:
            print("FOUND title: {t}".format(t=title))
        else:
            raise InvalidPageException("Pop up does not show 'Load Variable'")

    def load_from_file(self):
        # click on the file icon in the File row on "Load Variable" pop up
        print("...click on File icon in the File row on 'Load variable' pop up")
        load_button = self.driver.find_element_by_xpath(self._file_button_locator)
        load_button.click()
        file_explorer_pop_up = WebDriverWait(self.driver, 
                                             self._wait_timeout).until(EC.visibility_of_element_located((By.XPATH, self._file_explorer_pop_up_locator)))

    def do_load_file(self, main_page, var_name):
        print("...click on 'Load' button on 'Load Variable' pop up")
        self.driver.find_element_by_xpath(self._load_button_locator).click()
        main_page.wait_till_file_loaded(var_name)

    def close(self):
        # click on the close button on "Load Variable" pop up
        print("...click on 'Close' button on 'Load Variable' pop up")
        close_button = self.driver.find_element_by_xpath(self._close_button_locator)
        close_button.click()

    @property
    def selected_file(self):
        # return the selected file name in the "Load Variable" pop up
        selected_file = self.driver.find_element_by_xpath(self._selected_file_locator).get_attribute('value')
        return selected_file

    def variable_name(self):
        option_elements = self.driver.find_elements_by_xpath(self._variable_name_opts_locator)
        print("xxx xxx # of variable options elements: {}".format(len(option_elements)))
        return(option_elements[0].get_attribute('value'))

class FileExplorerModal(BasePage):

    _file_explorer_title_locator = '//div[@class="fade in modal"]//div[@class="modal-header"]//h4[@class="modal-title"]'

    _body_locator = '//div[@class="fade in modal"]//div[@class="modal-body"]'
    _left_arrow_locator = './/button[@class="path-back-button btn btn-default"]'
    _curr_path_locator = './/div[@class="breadcrumbs"]'
    _list_of_paths_locator = './/a[@class="path-segment"]'

    # _paths_list_locator is for finding the scroll list of directories
    _paths_list_locator = '//div[@class="fade in modal"]//div[@class="modal-body"]//ol[@class="file-list"]'

    _file_explorer_select_locator = '//div[@class="fade in modal"]//div[@class="modal-footer"]//button[text()="Select"]'

    def __init__(self, driver):
        super(FileExplorerModal, self).__init__(driver)

    def _validate_page(self, driver):
        title = driver.find_element_by_xpath(self._file_explorer_title_locator).text.strip()
        if "File Explorer" not in title:
            raise InvalidPageException("Pop up does not show 'File Explorer'")
        else:
            print("Found File Explorer title")
        return

    def __go_to_root_dir(self):
        # keep clicking on the left arrow on the File Explorer pop up
        # till we are at the root directory.
        at_root_dir = False
        body = self.driver.find_element_by_xpath(self._body_locator)
        left_arrow_element = body.find_element_by_xpath(self._left_arrow_locator)
        while at_root_dir == False:
            print("...click on left arrow")
            left_arrow_element.click()
            curr_path_element = body.find_element_by_xpath(self._curr_path_locator)
            paths_elements = curr_path_element.find_elements_by_xpath(self._list_of_paths_locator)
            if len(paths_elements) == 0:
                print("...at root dir")
                at_root_dir = True
                time.sleep(self._delay)

    def __get_sample_file(self, filename):
        # select each path specified in the filename from the scoll list of
        # paths, and finally click on the "Select" button.
        path_names = filename.split(os.path.sep)
        paths_list_element = self.driver.find_element_by_xpath(self._paths_list_locator)

        for p in path_names[1:]:
            path_locator = ".//li//span[text() = '{p}']".format(p=p)
            print("...click on {p}".format(p=p))
            path_element = paths_list_element.find_element_by_xpath(path_locator)
            path_element.click()
            #time.sleep(self._delay)
            time.sleep(2)

        print("...click on 'Select' button in File Explorer pop up")
        self.driver.find_element_by_xpath(self._file_explorer_select_locator).click()

        # verify that the Load Variable pop up says the selected filename 
        # in the 'File' input area
        file_input_area_locator = "//input[@value='{f}']".format(f=filename)
        self.driver.find_element_by_xpath(file_input_area_locator)
        
        
    def load_a_sample_file(self, filename):
        # /Users/muryanto1/work/vcdat/miniconda2/envs/vcdat/share/uvcdat/sample_data/clt.nc
        # sys.prefix: /Users/muryanto1/work/vcdat/miniconda2/envs/vcdat
        print("xxx in load_a_sample_file: {f}".format(f=filename))
        self.__go_to_root_dir()
        self.__get_sample_file(filename)



