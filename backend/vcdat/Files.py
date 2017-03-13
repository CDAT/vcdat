import os


def keyForDirOrFile(arr):
    try:
        n = arr['name']
    except:
        n = arr
    return n


def getFilesObject(start_path):
    if start_path[-1] != '/':
        name = os.path.basename(start_path)
    else:
        name = os.path.dirname(start_path)

    root = {
        'name': name,
        'sub_items': [],
        'path': start_path
    }

    for r, dirs, files in os.walk(start_path):
        # Find the current directory
        path_components = r[len(root["path"]):].split(os.path.sep)
        cur_dir = root
        for p in path_components:
            for f in cur_dir["sub_items"]:
                if keyForDirOrFile == p:
                    cur_dir = f
                    break

        dir_objs = [{'name': d, 'path': os.path.join(r, d), 'sub_items': []} for d in dirs]
        cur_dir["sub_items"] = dir_objs + files
        cur_dir["sub_items"].sort(key=keyForDirOrFile)

    return root
