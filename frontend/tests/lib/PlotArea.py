import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from BasePage import BasePage
from BasePage import InvalidPageException

class PlotArea(BasePage):
    _rows_cols_toolbar_locator = "//div[@id='main-container']//div[@class='spreadsheet-toobar form-inline']//span"
    

    def __init__(self, driver):
        super(PlotArea, self).__init__(driver)

    def _find_row_left_arrow_element(self):

        rows_cols_toolbar_elements = self.driver.find_elements_by_xpath(self._rows_cols_toolbar_locator)
        row_label_locator = "//span[@class='spinner input-group input-group-sm']//span[@class='input-group-addon']"
        row_text = rows_cols_toolbar_elements[0].find_elements_by_xpath(row_label_locator).text()
        print("xxx xxx row_text: {}".format(row_text))

            
        
