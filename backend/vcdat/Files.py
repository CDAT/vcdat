import os
import datetime


def isValidFile(start_path, item):
    if os.path.isfile(os.path.join(start_path, item)) and item[0] != '.' and item.endswith('.nc'):
        return True
    return False


def isValidDir(start_path, item):
    if not os.path.isfile(os.path.join(start_path, item)) and item[0] != '.':
        return True
    return False


def getFilesObject(start_path):
    if start_path != '/':
        name = start_path.split('/')[-2]
    else:
        name = '/'

    cur_dir_items = {
        'name': name,
        'subItems': {},
        'directory': True,
        'path': start_path
    }
    for item in os.listdir(start_path):
        if isValidFile(start_path, item) or isValidDir(start_path, item):
            obj = {
                'name': item,
                'subItems': {},
                'directory': False,
                'path': start_path,
                'modifiedTime': datetime.datetime.fromtimestamp(os.path.getmtime(os.path.join(start_path, item)))
            }
            if isValidDir(start_path, item):
                obj['directory'] = True
            cur_dir_items['subItems'][item] = obj
    return cur_dir_items
