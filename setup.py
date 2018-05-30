import os
import subprocess
from setuptools import setup
import shutil

if not os.path.exists("backend/vcdat/resources"):
    os.mkdir("backend/vcdat/resources")

os.chdir("frontend")
subprocess.call(["npm", "run", "release"])
for f in os.listdir("deps"):
    if f[0] == ".":
        continue
    shutil.copyfile("deps/" + f, "../backend/vcdat/resources/" + f)
os.chdir("..")

setup(
  name="vcdat",
  version="0.7.0",
  description="A user interface for visualizing and analysing climate data.",
  url="http://github.com/UV-CDAT/vcdat",
  packages=['vcdat'],
  package_dir={'vcdat': 'backend/vcdat'},
  package_data={"vcdat": ["resources/" + f for f in os.listdir("backend/vcdat/resources") if f[0] != "."]},
  scripts=["scripts/vcdat", "scripts/check_vcdat_update.py"]
)
