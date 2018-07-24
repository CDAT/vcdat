from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
import pytest

# Declare Fixtures
# --------------------------------------------------------------------


@pytest.fixture()
def driver():
    driver = webdriver.Chrome()
    driver.implicitly_wait(5)
    driver.get("localhost:5000")
    yield driver
    driver.close()


# End to End testing with Selenium
# --------------------------------------------------------------------

@pytest.mark.selenium
def test_server_running(driver):
    assert "vCDAT" in driver.title


@pytest.mark.selenium
def test_variable_loads(driver):
    app = driver.find_element_by_xpath("//div[@id='app']")
    print("xxx found app xxx")
    app_container = driver.find_element_by_xpath("//div[@id='app-container']")
    print("xxx found app_container xxx")
