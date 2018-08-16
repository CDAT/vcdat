import time

from BasePage import BasePage
from BasePage import InvalidPageException

class AddVariableModal(BasePage):

    # _file_explorer_locator = "btn-primary"
    _load_from_locator = "load-from"
    
    def __init__(self, driver):
        super(AddVariableModal, self).__init__(driver)

    def _validate_page(self, driver):
        title = driver.find_element_by_class_name("modal-title").text.strip()
        if "Load Variable" not in title:
            raise InvalidPageException("Pop up does not show 'Load Variable'")

    @property
    def load_from_file(self):
        print("xxx load_from_file xxx")
    
        load_from = self.driver.find_element_by_class_name(self._load_from_locator)        
        load_button = load_from.find_element_by_xpath('.//span[@class="input-group-btn"]//button[@class="btn btn-primary"]')
        return load_button.click()



class FileExplorerModal(BasePage):

    _dialogs_locator = '//div[@role="dialogs"]'
    
    _left_arrow_locator = '//div[@role="dialog"]//button[@class="path-back-button"]'
    _curr_path_locator = '//div[@role="dialog"]//div[@class="breadcrumbs"]'
    _list_of_paths_locator = './/a[@class="path-segment"]'
    def __init__(self, driver):
        super(FileExplorerModal, self).__init__(driver)

    def _validate_page(self, driver):
        time.sleep(3)
        #title = driver.find_element_by_class_name("modal-title").text.strip()
        #title = driver.find_element_by_xpath(self._pop_up_title_locator).text.strip()

        print("xxx FileExplorerModal._validate_page() xxx")
        all_dialogs = driver.find_elements_by_xpath(self._dialogs_locator)
        for dialog in all_dialogs:
            dialog_attr = dialog.get_attribute("aria-hidden")
            if dialog_attr and dialog_attr == 'true':
                continue
            title = dialog.find_element_by_class_name("modal-title").text.strip()
            print("xxx xxx xxx title: {t}".format(t=title))
            if "File Explorer" not in title:
                raise InvalidPageException("Pop up does not show 'File Explorer'")
            else:
                print("Found File Explorer title")
                return

    def __go_to_root_dir(self):
        at_root_dir = False
        left_arrow_element = self.driver.find_element_by_xpath(self._left_arrow_locator)
        print("xxx xxx __go_to_root_dir xxx")
        while at_root_dir == False:
            print("xxx xxx ...__go_to_root_dir() xxx")
            left_arrow_element.click()
            curr_path_element = self.driver.find_element_by_xpath(self._curr_path_locator)
            paths_elements = curr_path_element.find_elements_by_xpath(self._list_of_paths_locator)
            if len(paths_elements) == 0:
                print("xxx no more elements xxx")

    def load_a_sample_file(self, filename):
        # /Users/muryanto1/work/vcdat/miniconda2/envs/vcdat/share/uvcdat/sample_data/clt.nc
        # sys.prefix: /Users/muryanto1/work/vcdat/miniconda2/envs/vcdat
        print("xxx in load_a_sample_file: {f}".format(f=filename))
        self.__go_to_root_dir()
        time.sleep(3)
        return 0
