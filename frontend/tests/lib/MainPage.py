import time

from BasePage import BasePage
from BasePage import InvalidPageException
from selenium.common.exceptions import NoSuchElementException

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains

class MainPage(BasePage):

    _alert_locator = '//div[@role="alert"]'

    _var_delete_locator = "//li[@class='action-remove-button']"

    _variable_plot_locator = "//div[@class='plotter-plots']//div[@id='plot000']"

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

        #var_locator = "//ul[@id='var-list']//li[@class='active']//a[contains(text() = \"{t}\")]".format(t=var)
        #var_locator = '//div[@class="left-size-list"]//div[@class="scroll-area"]//ul[@id="var-list"]//li[@class="active"]'
        return self.driver.find_element_by_xpath(var_locator)
         

    def delete_variable(self, var):
        print("...click on the variable {v} on main page".format(v=var))
        var_element = self.find_variable(var)
        var_element.click()

        print("...click on delete variable (the x button)")
        var_delete_element = self.driver.find_element_by_xpath(self._var_delete_locator)
        var_delete_element.click()

    def plot_variable(self, var):
        print("...click on the variable {v} on main page".format(v=var))
        var_element = self.find_variable(var)

        plot_area_element = self.driver.find_element_by_xpath(self._variable_plot_locator)
        print("...drag the variable to the plot area...")
        ActionChains(self.driver).drag_and_drop(var_element, plot_area_element).perform()
        print("...sleep for 20 seconds...")
        time.sleep(20)
