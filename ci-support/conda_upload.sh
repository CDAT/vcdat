#!/usr/bin/env bash
PKG_NAME=vcdat
USER=uvcdat
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
export CONDA_BLD_PATH=${HOME}/conda-bld
export VERSION=`date +%Y.%m.%d`
echo "Cloning recipes"
git clone git://github.com/UV-CDAT/conda-recipes
cd conda-recipes
# uvcdat creates issues for build -c uvcdat confises package and channel
ln -s ../conda vcdat
python ./prep_for_build.py 
echo "Building now"
conda build -c conda-forge -c uvcdat $PKG_NAME
echo "Uploading"
anaconda -t $CONDA_UPLOAD_TOKEN upload -u $USER -l nightly $CONDA_BLD_PATH/$OS/$PKG_NAME-*`date +%Y`*.tar.bz2 --force

