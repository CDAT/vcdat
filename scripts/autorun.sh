#!/bin/bash

CONDA_ENV=${CONDA_ENV:-nightly}
VCSJS_PORT=${VCSJS_PORT:-8888}
VCDAT_PORT=${VCDAT_PORT:-5000}
export UVCDAT_ANONYMOUS_LOG="no"
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

vcs-server -p ${VCSJS_PORT} &
vcs_pid=$!
python $curpath/backend/vcdat/app.py --vcs_server="localhost:${VCSJS_PORT}" --port=${VCDAT_PORT} &
be_pid=$!
cd frontend
$(npm bin)/webpack --progress --colors --watch &
fe_pid=$!

pids=($vcs_pid $be_pid $fe_pid)

python $curpath/scripts/monitor_procs.py ${pids[@]}
