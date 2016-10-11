#!/bin/bash

CONDA_ENV="vcdat"

curpath=`pwd`
while [ -n $curpath ] && [ `basename $curpath` != "vcdat" ]; do
    curpath=`dirname $curpath`
done

if [ -n $CONDA_PREFIX ] && [ "$CONDA_PREFIX" = "$curpath/backend/venv" ]; then
    echo "Virtual Environment already loaded"
else
    echo "Loading virtual environment..."
    source activate ${CONDA_ENV}
fi

python $curpath/backend/vcdat/app.py &
be_pid=$!
cd frontend
$(npm bin)/webpack --progress --colors --watch &
fe_pid=$!

trap "{ kill $be_pid; kill $fe_pid; }" INT

cat # Wait until trapped ctrl+c