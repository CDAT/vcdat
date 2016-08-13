#!/bin/bash

CONDA_ENV="venv"
CONDA_CHANNELS="-c uvcdat/label/nightly/ -c uvcdat -c cpcloud"
CONDA_EXTRA_PACKAGES="hdf5=1.8.16 pyqt=4.11.3 npm"

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

be_pid=0

refresh_backend() {
   if [ $be_pid -ne 0 ]; then
      kill $be_pid
   fi
   python $curpath/backend/vcdat/app.py &
   be_pid=$!
}

refresh_frontend() {
   pushd $curpath/frontend
   $(npm bin)/webpack
   popd
}

route_notification() {
   refresh_frontend
   refresh_backend
}

trap "{ kill $be_pid; }" INT

route_notification

fswatch -r -o -e "pyc" -e 'css' -e 'html' -e "$curpath/frontend/dist" $curpath/backend $curpath/frontend | (while read; do route_notification; done;)
