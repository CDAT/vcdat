#!/usr/bin/env bash
PKG_NAME=vcdat
USER=cdat
export PATH="$HOME/miniconda/bin:$PATH"
echo "Trying to upload conda"
if [ `uname` == "Linux" ]; then
    OS=linux-64
    echo "Linux OS"
    conda update -y -q conda
else
    echo "Mac OS"
    OS=osx-64
fi

mkdir ~/conda-bld
conda install -q anaconda-client conda-build
conda config --set anaconda_upload no
conda install -f six
export CONDA_BLD_PATH=${HOME}/conda-bld
export VERSION=`date +%Y.%m.%d`
echo "Cloning recipes"
git clone git://github.com/cdat/conda-recipes
cd conda-recipes
# cdat creates issues for build -c cdat confuses package and channel
ln -s ../conda vcdat
python ./prep_for_build.py -l 0.6.1
echo "Building now"
conda build -c cdat/label/nightly -c conda-forge -c cdat $PKG_NAME
echo "Uploading"
anaconda -t $CONDA_UPLOAD_TOKEN upload -u $USER -l nightly $CONDA_BLD_PATH/noarch/$PKG_NAME-*`date +%Y`*.tar.bz2 --force

