import os


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
                'path': start_path
            }
            if isValidDir(start_path, item):
                obj['directory'] = True
            cur_dir_items['subItems'][item] = obj
    if len(cur_dir_items['subItems'].keys()) == 0:
        cur_dir_items['subItems']['empty'] = {
            'name': 'empty',
            'subItems': {},
            'directory': False,
            'path': start_path
        }
    return cur_dir_items
