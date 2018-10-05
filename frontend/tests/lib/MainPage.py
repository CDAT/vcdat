import time

from BasePage import BasePage
from BasePage import InvalidPageException
from selenium.common.exceptions import NoSuchElementException

from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains


class MainPage(BasePage):

    _alert_locator = '//div[@role="alert"]'

    _var_delete_locator = "//li[@class='action-remove-button']"

    # _variable_plot_locator = "//div[@class='plotter-plots']//div[@id='plot000']//h4[text() = 'Variables:']"
    #_variable_plot_locator = "//div[@class='plotter-plots']//div[@id='plot000']//div[@class='plot-var first-var']"
    #_variable_plot_locator = "//div[@class='plotter-plots']//div[@data-plot-index=0]"

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

    def plot_variablePREV(self, var, index):
        # REVISIT, should take an argument to plot in which plot area.

        print("...click on the variable {v} on main page".format(v=var))
        var_element = self.find_variable(var)
        var_element.click()
        print("...sleep for 3 seconds...")
        time.sleep(3)
        variable_plot_locator = "//div[@class='plotter-plots']//div[@data-plot-index='{i}']".format(i=index)
        plot_area_element = self.driver.find_element_by_xpath(variable_plot_locator)
        plot_area_element.click()
        print("...drag the variable to the plot area...")
        # WORKS - my mouse has to be on the plot area
        ActionChains(self.driver).drag_and_drop(var_element, plot_area_element).perform()
        #ActionChains(self.driver).drag_and_drop_by_offset(var_element, 2, -1).perform()

        # WORKS - my mouse has to be on the plot area
        #ActionChains(self.driver).click_and_hold(var_element).move_by_offset(10, -10).release().perform()
        print("...sleep for 10 seconds...")
        time.sleep(10)


    def plot_variable(self, var, index):
        # REVISIT, should take an argument to plot in which plot area.

        print("...click on the variable {v} on main page".format(v=var))
        var_element = self.find_variable(var)
        var_element.click()
        print("...sleep for 3 seconds...")
        time.sleep(3)
        variable_plot_locator = "//div[@class='plotter-plots']//div[@data-plot-index='{i}']".format(i=index)
        plot_area_element = self.driver.find_element_by_xpath(variable_plot_locator)
        plot_area_element.click()
        print("...drag the variable to the plot area...")
        # WORKS - my mouse has to be on the plot area
        #ActionChains(self.driver).drag_and_drop(var_element, plot_area_element).perform()

        # WORKS - my mouse has to be on the plot area
        #ActionChains(self.driver).click_and_hold(var_element).move_by_offset(10, -10).release().perform()

        
        #ActionChains(self.driver).click_and_hold(var_element).move_to_element(plot_area_element).click(plot_area_element).release().perform()
        #ActionChains(self.driver).click_and_hold(var_element).move_to_element(plot_area_element).click_and_hold(plot_area_element).release().perform()
        
        ActionChains(self.driver).click_and_hold(var_element).move_to_element_with_offset(plot_area_element, 0, 0).release().perform()
        print("...sleep for 5 seconds...")
        time.sleep(5)
