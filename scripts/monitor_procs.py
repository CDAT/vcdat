#!/usr/bin/env python

import sys
import os
import signal

# This script will take a list of PIDs to kill when it gets a ctrl+c
pids = [int(a) for a in sys.argv[1:]]
try:
    for line in sys.stdin:
        pass
except KeyboardInterrupt:
    print ""
print "Exiting processes..."
for p in pids:
    pgroup = os.getpgid(p)
    os.killpg(pgroup, signal.SIGHUP)
