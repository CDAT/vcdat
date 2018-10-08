from abc import abstractmethod

class BasePage(object):
    """ All page objects inherit from this """

    _wait_timeout = 10
    _delay = 3

    def __init__(self, driver):
        self._validate_page(driver)
        self.driver = driver

    @abstractmethod
    def _validate_page(self, driver):
        return

class InvalidPageException(Exception):
    """ Throw this exception when we do not find the correct page """
    pass

