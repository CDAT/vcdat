export UVCDAT_ANONYMOUS_LOG=False
export UVCDAT_SETUP_PATH=${HOME}
export PATH=${HOME}/miniconda/bin:${PATH}
cd frontend
npm install
cd ..
python setup.py install
cd frontend
npm run coverage
RESULT=$?
npm run coveralls
RESULT=$RESULT + $?
cd ..
echo "test commands exit result:",$RESULT
if [ $RESULT -eq 0 -a $CIRCLE_BRANCH == "master" ]; then conda install -n root conda-build anaconda-client ; fi
if [ $RESULT -eq 0 -a $CIRCLE_BRANCH == "master" ]; then bash ./ci-support/conda_upload.sh ; fi
exit $RESULT

