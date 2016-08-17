### Testing
New Tests
* Add Test to `FlaskTests.py` in `backend/vcdat/FlaskTests.py`

Reading
* http://flask.pocoo.org/docs/0.11/testing/
* http://damyanon.net/flask-series-testing/
* https://docs.python.org/2/library/unittest.html#test-discovery

Running test 

    cd ~/project/vcdat
    source activate backend/venv
    python backend/vcdat/FlaskTests.py 
    .......
    -----------
    Ran 7 tests in 0.541s

    OK
    
coverage

    coverage run backend/vcdat/FlaskTests.py 
    .......
    ----------------------------------------------------------------------
    Ran 7 tests in 0.464s
    
    OK
    (../venv/) harris112@harris112ml1:[vcdat]:[refactor]:[24508]> coverage report
    Name                               Stmts   Miss  Cover
    ------------------------------------------------------
    backend/vcdat/Files.py                23      2    91%
    backend/vcdat/FlaskTests.py           36      0   100%
    backend/vcdat/GraphicsMethods.py      25      2    92%
    backend/vcdat/Templates.py             3      0   100%
    backend/vcdat/app.py                  55      8    85%
    ------------------------------------------------------
    TOTAL                                142     12    92%


    