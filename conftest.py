# content of conftest.py

import pytest


def pytest_addoption(parser):
    parser.addoption(
        "--selenium", action="store_true", default=False, help="Run selenium tests"
    )


def pytest_collection_modifyitems(config, items):
    if config.getoption("--selenium"):
        # --selenium was given as a cli option: do not skip selenium tests
        return
    skip_selenium = pytest.mark.skip(reason="needs --selenium option to run")
    for item in items:
        if "selenium" in item.keywords:
            item.add_marker(skip_selenium)