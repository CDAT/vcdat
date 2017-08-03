#!/bin/bash

CONDA_ENV="nightly"

curpath=`pwd`

while [ -n $curpath ] && [ `basename $curpath` != "vcdat" ]; do
    curpath=`dirname $curpath`
done

if [ -n $CONDA_PREFIX ]; then
    echo "Virtual Environment already loaded"
else
    echo "Loading virtual environment..."
    source activate ${CONDA_ENV}
fi

vcs-server -p 8888 &
vcs_pid=$!
python $curpath/backend/vcdat/app.py --vcs_server="localhost:8888" &
be_pid=$!
cd frontend
$(npm bin)/webpack --progress --colors --watch &
fe_pid=$!

pids=($vcs_pid $be_pid $fe_pid)

python $curpath/scripts/monitor_procs.py ${pids[@]}
