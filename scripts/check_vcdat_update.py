#!/usr/bin/env python

from __future__ import print_function
import argparse
import shlex
import subprocess


def run_command(cmd, stdin=None, verbose=False):
    commands = cmd.split("|")
    if len(commands) > 1:
        p = subprocess.Popen(
            shlex.split(
                commands[0]),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            stdin=stdin)
        return run_command("|".join(commands[1:]), stdin=p.stdout)
    else:
        if verbose: print("Excuting:",cmd)
        cmd = shlex.split(cmd)
        p = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            stdin=stdin)
        o, e = p.communicate()
        return o


P = argparse.ArgumentParser(
    formatter_class=argparse.ArgumentDefaultsHelpFormatter)

P.add_argument(
    "-u",
    "--update",
    action="store_true",
    default=False,
    help="update env if needed")
P.add_argument("-C", "--copy", action="store_true", default=False,
               help="create a copy of the environment before updating")
P.add_argument("-v", "--verbose", default=False, action="store_true", help="verbose mode")
P.add_argument(
    "-c",
    "--channels",
    "--conda-channel",
    dest="channels",
    default=[],
    help="conda channel arguments",
    nargs="+")


P = P.parse_args()

# retrieve cdat channels used
cmd = "conda list | grep cdat | awk '{print $NF}'"
channels = run_command(cmd).split()
if "<pip>" in channels:
    channels.remove("<pip>")
if channels[0].find(":") != -1:
    channels.pop(0)
channels = list(set(channels))
if "cdat/label/nightly" in channels:
    channels.remove("cdat/label/nightly")
    channels.insert(0, "cdat/label/nightly")
channels = P.channels + channels
# Did the user send us more channels
cmd = "conda update --dry-run vcs-js vcdat -c {}".format(" -c ".join(channels))
result = run_command(cmd, verbose=P.verbose)
update = result.find("UPDATED")
if update > -1:
    spl = result[update + 8:].split("\n")
    pkgs = []
    for l in spl:
        if l.strip() != "":
            pkgs.append(l.strip())

    print("We found that we can do the following update:")
    print("\n".join(pkgs))
    if not P.update:
        answer = raw_input(
            "An update to VCDAT is available, do you want to update? [y/N]")
        if answer == "":
            answer = "n"
    else:
        answer = "y"
    if answer[0].lower() == "y":
        cmd = "conda update -y vcs-js vcdat -c {}".format(
            " -c ".join(channels))
        run_command(cmd, verbose=P.verbose)
