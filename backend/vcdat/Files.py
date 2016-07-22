import os

def isValidFile(start_path, item):
    if os.path.isfile(os.path.join(start_path, item)) and item[0] != '.' and item.endswith('.nc'):
        return True
    return False

def isValidDir(start_path, item):
    if not os.path.isfile(os.path.join(start_path, item)) and item[0] != '.':
        return True
    return False

def getFiles(start_path):
    print start_path
    cur_dir_items = []
    for item in os.listdir(start_path):
        if isValidFile(start_path, item) or isValidDir(start_path, item):
            obj = {
                'name': item,
                'sub_items': {},
                'directory': False,
                'path': start_path
            }
            if isValidDir(start_path, item):
                obj['directory'] = True
            cur_dir_items.append(obj)
    return cur_dir_items
