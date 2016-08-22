## Testing
###New Tests
* Add Test to `FlaskTests.py` in `backend/vcdat/FlaskTests.py`

###Reading
* http://flask.pocoo.org/docs/0.11/testing/
* http://damyanon.net/flask-series-testing/
* https://docs.python.org/2/library/unittest.html#test-discovery

###Running test 

    > cd ~/project/vcdat
    > source activate backend/venv
    > python backend/vcdat/FlaskTests.py 
    .......
    -----------
    Ran 7 tests in 0.541s

    OK
    
###Coverage

    > coverage run backend/vcdat/FlaskTests.py 
    .......
    ----------------------------------------------------------------------
    Ran 7 tests in 0.464s
    
    OK
    > coverage report
    Name                               Stmts   Miss  Cover
    ------------------------------------------------------
    backend/vcdat/Files.py                23      2    91%
    backend/vcdat/FlaskTests.py           36      0   100%
    backend/vcdat/GraphicsMethods.py      25      2    92%
    backend/vcdat/Templates.py             3      0   100%
    backend/vcdat/app.py                  55      8    85%
    ------------------------------------------------------
    TOTAL                                142     12    92%

###HTML Coverage Output 

You can generate html files with the coverage report and you are able to see what lines where missed on the testing:

####Missed Lines on app.py:

![app.py output](https://github.com/pawpepe/media/blob/master/Screen%20Shot%202016-08-22%20at%208.56.55%20AM.png)

#### Coverage Report:
![coverageReport](https://github.com/pawpepe/media/blob/master/Screen%20Shot%202016-08-22%20at%209.06.15%20AM.png)

#### Command Line for the HTML coverage report 
`coverage run backend/vcdat/FlaskTests.py`


`coverage html` or for the html folder to be created in a diferent path `coverage html -d another\path` 

pep8

    > pep8 backend/vcdat
