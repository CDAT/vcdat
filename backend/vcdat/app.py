import os
import tempfile
import vcs
import cdms2
import json
from flask import Flask, send_from_directory, request, send_file, Response
from GraphicsMethods import get_gm, get_default_gms
from Templates import get_t, templ_from_json
from Files import getFilesObject
from Colormaps import get_cmaps
import weakref
import functools


def jsonresp(f):
    @functools.wraps(f)
    def wrap(*args, **kwargs):
        response_body = f(*args, **kwargs)
        r = Response(response_body, mimetype="application/json")
        return r
    return wrap

  
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
        return send_from_directory(dir_path, 'taco')


@app.route("/getTemplates")
@jsonresp
def get_templates():
    templates = get_t()
    return json.dumps(templates)

  
@app.route("/plotTemplate", methods=["POST"])
def plot_template():
    tmpl = request.get_json()
    t = templ_from_json(tmpl)
    canvas = vcs.init(bg=True)
    g = vcs.getboxfill()
    v = [[0] * 10] * 10
    v = cdms2.tvariable.TransientVariable(v)
    t.plot(canvas, v, g)
    t.drawColorBar([(0,0,0,0)], [0, 1], x=canvas)
    canvas.backend.renWin.Render()
    del vcs.elements["template"][t.name]
    _, tmp = tempfile.mkstemp(suffix=".png")
    canvas.png(tmp)
    resp = send_file(tmp)
    # Clean up file automatically after request
    wr = weakref.ref(resp, lambda x: os.remove(tmp))
    canvas.close()
    return resp

  
@app.route("/getGraphicsMethods")
@jsonresp
def get_graphics_methods():
    graphics_methods = get_gm()
    return json.dumps(graphics_methods)

  
@app.route("/getDefaultMethods")
@jsonresp
def get_default_methods():
    default_gms = get_default_gms()
    return json.dumps(default_gms)

  
@app.route("/getColormaps")
@jsonresp
def get_colormaps():
    colormaps = get_cmaps()
    return json.dumps(colormaps)


@app.route("/browseFiles")
@jsonresp
def browse_files():
    if "data_root" in app.config:
        starting_path = app.config["data_root"]
    elif os.path.exists(vcs.sample_data):
        starting_path = vcs.sample_data
    else:
        starting_path = os.getcwd()
    file_obj = getFilesObject(starting_path)
    return json.dumps(file_obj)


@app.route("/loadVariablesFromFile")
@jsonresp
def load_variables_from_file():
    file_path = request.args.get('path')

    f = cdms2.open(file_path)
    returned = []
    f_var = f.getVariables()
    f_var.sort(key=lambda x: len(x.getAxisList()), reverse=True)
    for var in f_var:
        var_id = getattr(var, 'id', "")
        var_shape = getattr(var, 'shape', "")
        var_name = ""
        for att in ["long_name", "title"]:
            if hasattr(var, att):
                var_name = getattr(var, att)
                break

        var_units = getattr(var, 'units', "")

        output = var_id + " " + str(var_shape) + " [" + var_name + ": " + var_units + "]"
        returned.append(output)

    for ax in f.axes:
        axes_name = ax
        axes_length = len(f.axes[ax])
        axes_units = getattr(f.axes[ax], 'units', "")
        axes_lower = f.axes[ax][0]
        axes_upper = f.axes[ax][-1]

        output = axes_name + " (" + str(axes_length) + ") - [" + axes_units + ": (" + str(axes_lower) + ", " + str(axes_upper) + ")]"
        returned.append(output)

    return json.dumps({'variables': returned})


@app.route("/getVariableProvenance")
@jsonresp
def get_variable_provenance():
    path = request.args.get('path')
    varname = request.args.get('varname')
    f = cdms2.open(path)
    v = f[varname]
    ep = v.exportProvenance()
    return json.dumps(ep)


if __name__ == "__main__":   # pragma: no cover
    app.run(debug=True)
