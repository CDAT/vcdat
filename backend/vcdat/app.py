import os
import vcs, cdms2
import json
from flask import Flask, send_from_directory, request
from GraphicsMethods import get_gm
from Templates import get_t
from Files import getFiles
app = Flask(__name__, static_url_path='')

_ = vcs.init()

@app.route("/")
def hello():
    path = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..', 'frontend/src/'))
    return send_from_directory(path, 'index.html')

@app.route("/deps/<path:path>")
def serve_resource_file(path):
    dir_path = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..', 'frontend/'))
    if path in ['Styles.css', 'jquery-2.2.4.min.js', 'jquery-ui.min.js', 'jquery-ui.min.css', 'clt_image.png', 'bootstrap-themed.min.css', 'add_plot.svg']:
        return send_from_directory(dir_path, 'deps/' + path)
    if path in ['Bundle.js', 'Bundle.js.map']:
        return send_from_directory(dir_path, 'dist/' + path)
    else:
        print 'Unable to serve file ', path
        return send_from_directory(dir_path, 'taco')

@app.route("/getTemplates")
def get_templates():
    templates = get_t()
    return json.dumps(templates)

@app.route("/getGraphicsMethods")
def get_graphics_methods():
    graphics_methods = get_gm()
    return graphics_methods



@app.route("/browseFiles")
def browse_files():
    start_path = request.args.get('path')
    if start_path is None:
        start_path = os.path.expanduser('~')
    files = getFiles(start_path)
    print 'got files in app'
    obj = {
        'files':files,
        'dir_path':start_path
    }
    return json.dumps(obj)

@app.route("/loadVariablesFromFile")
def load_variables_from_file():
    file_path = request.args.get('path')
    f = cdms2.open(file_path);
    return json.dumps({'variables': f.listvariables()})

if __name__ == "__main__":
    app.run()
