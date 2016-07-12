#!/bin/bash

curpath=`pwd`
while [ -n $curpath ] && [ `basename $curpath` != "vcdat" ]; do
    curpath=`dirname $curpath`
done

if [ -n $VIRTUAL_ENV ] && [ "$VIRTUAL_ENV" = "$curpath/backend/venv" ]; then
    echo "Virtual Environment already loaded"
else
    echo "Loading virtual environment..."
    source $curpath/backend/venv/bin/activate
fi

be_pid=0
webpackid=0

ctrl_c() {
        echo "** Trapped CTRL-C"
        kill $webpackid
}

refresh_backend() {
   if [ $be_pid -ne 0 ]; then
      kill $be_pid
   fi
   python $curpath/backend/vcdat/app.py &
   be_pid=$!
}


route_notification() {
   refresh_backend
}

trap ctrl_c EXIT



trap "{ kill $be_pid; }" INT

route_notification
pushd $curpath/frontend
$(npm bin)/webpack --watch
webpackid=$!
popd


fswatch -r -o -e "pyc" -e "$curpath/frontend/dist" $curpath/backend | (while read; do route_notification; done;)
