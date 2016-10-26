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

vcs-server > $curpath/vcs.log &
vcs_pid=$!
python $curpath/backend/vcdat/app.py > $curpath/vcdat.log &
be_pid=$!
cd frontend
$(npm bin)/webpack --progress --colors --watch &
fe_pid=$!

python $curpath/scripts/monitor_procs.py $vcs_pid $be_pid $fe_pid
