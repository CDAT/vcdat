
# Exit script if you try to use an uninitialized variable.
set -o nounset

# Exit script if a statement returns a non-true return value.
set -o errexit

# Use the error status of the first failure, rather than that of the last item in a pipeline.
set -o pipefail

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

