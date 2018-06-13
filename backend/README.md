## Testing

### New Tests
* Add Test to `test_flask.py` in `backend/vcdat/test_flask.py`

### Reading
* http://flask.pocoo.org/docs/0.11/testing/
* http://damyanon.net/flask-series-testing/
* https://docs.pytest.org/en/latest/getting-started.html#getstarted

### Running the backend tests 

    > cd ~/project/vcdat
    > source activate backend/venv
    > pip install -e .[test]
    > python setup.py install
    > py.test
    
    backend/tests/test_flask.py ...........                            [100%]

    ======================= 11 passed in 3.24 seconds ========================

    OK
    
### Coverage

__Make sure the dev dependencies have been installed via the pip command above__
__Additionally, the coverage code gets confused with relative paths, so installing is the easiest way to get accurate coverage numbers__

    > python setup.py install
    > py.test --cov backend/vcdat --cov-report term-missing
    ---------- coverage: platform darwin, python 2.7.15-final-0 ----------
    Name                                  Stmts   Miss  Cover   Missing
    -------------------------------------------------------------------
    backend/vcdat/Colormaps.py                7      5    29%   5-9
    backend/vcdat/Files.py                   22      1    95%   21
    backend/vcdat/GraphicsMethods.py         19     19     0%   1-44
    backend/vcdat/Templates.py               10      7    30%   5-11
    backend/vcdat/__init__.py                 0      0   100%
    backend/vcdat/app.py                    128     51    60%   31-34, 44-65, 74-79, 88-121, 127-128, 134-135, 193-197
    backend/vcdat/endpoints/__init__.py       0      0   100%
    backend/vcdat/models/__init__.py          0      0   100%
    backend/vcdat/test_flask.py              55      0   100%
    -------------------------------------------------------------------
    TOTAL                                   241     83    66%


    ============================================== 11 passed in 3.65 seconds ==============================================

### HTML Coverage Output

You can generate html files with the coverage report with detailed information about which lines were covered:

    > py.test --cov backend/vcdat --cov-report html

#### Missed Lines on app.py:

![app.py output](https://github.com/pawpepe/media/blob/master/Screen%20Shot%202016-08-22%20at%208.56.55%20AM.png)

#### Coverage Report:

![coverageReport](https://github.com/pawpepe/media/blob/master/Screen%20Shot%202016-08-22%20at%209.06.15%20AM.png)

### pep8

    > pep8 backend/vcdat
