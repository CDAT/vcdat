#!/usr/bin/env bash
ls
pwd
export PATH=${HOME}/miniconda/bin:${PATH}
conda install -c cdat/label/nightly -c conda-forge -c cdat nose vcs mesalib nodejs vcs-js
