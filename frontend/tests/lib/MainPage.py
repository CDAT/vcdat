import time

from BasePage import BasePage
from BasePage import InvalidPageException

class MainPage(BasePage):

    def __init__(self, driver):
        super(MainPage, self).__init__(driver)

    @property
    def add_variable(self):
        variables = self.driver.find_element_by_class_name("var-list-container")
        return variables.find_element_by_class_name("action-add-button").click()

