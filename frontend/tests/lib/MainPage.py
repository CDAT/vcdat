import time

from BasePage import BasePage
from BasePage import InvalidPageException
from selenium.common.exceptions import NoSuchElementException

class MainPage(BasePage):

    _alert_locator = '//div[@role="alert"]'

    def __init__(self, driver):
        super(MainPage, self).__init__(driver)

    def add_variable(self):
        variables = self.driver.find_element_by_class_name("var-list-container")
        variables.find_element_by_class_name("action-add-button").click()

    def wait_till_file_loaded(self):
        # this may not belong to MainPage class
        alert_element_text = self.driver.find_element_by_xpath(self._alert_locator).text.strip()
        assert(alert_element_text.startswith("Successfully Loaded"))
        
        alert_is_up = True
        while alert_is_up:
            try:
                self.driver.find_element_by_xpath(self._alert_locator)
                print("...sleep 1 sec, and recheck if alert is still up...")
                time.sleep(1)
            except NoSuchElementException:
                alert_is_up = False


    # Variables panel
    def find_variable(self, var):
        '''
        Verifies that <var> is listed on the 'Variables' left panel
        '''
        var_locator = "//ul[@id='var-list']//a[text() = \"{t}\"]".format(t=var)
        self.driver.find_element_by_xpath(var_locator)
        
