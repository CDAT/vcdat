
import os
import time
import unittest
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

class BaseTestCase(unittest.TestCase):
    def setUp(self):
        options = Options()
        options.add_argument("--headless")
        self.driver = webdriver.Chrome(executable_path="/usr/local/bin/chromedriver")
        #self.driver = webdriver.Firefox(firefox_options=options, executable_path="/usr/local/bin/geckodriver")
        self.driver.implicitly_wait(5)
        #self.driver.maximize_window()
        self.driver.get("localhost:5000")
        time.sleep(3)

    def tearDown(self):
        self.driver.quit()

