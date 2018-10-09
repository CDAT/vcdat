import unittest
import os
import sys
import time

this_dir = os.path.abspath(os.path.dirname(__file__))
lib_dir = os.path.join(this_dir, '..', 'lib')
sys.path.append(lib_dir)

# from BaseTestCase import BaseTestCase                                                                                              
from BaseTestCase import BaseTestCase
from MainPage import MainPage
from PlotArea import PlotArea

class plotAreaTest(BaseTestCase):

    def _add_row(self, main_page):
        #
        j = 0



if __name__ == '__main__':
    unittest.main(verbosity=2)
