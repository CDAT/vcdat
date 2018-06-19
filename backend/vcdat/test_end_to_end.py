from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import pytest

# Declare Fixtures
#--------------------------------------------------------------------
@pytest.fixture()
def driver():
    driver = webdriver.Chrome()
    yield driver
    driver.close()




# End to End testing with Selenium
#--------------------------------------------------------------------

@pytest.mark.selenium
def test_server_running(driver):
    driver = webdriver.Chrome()
    driver.get("localhost:5000")
    assert "vCDAT" in driver.title
    driver.close()

@pytest.mark.selenium
def test_variable_loads(driver):
    
    driver.get("localhost:5000")

