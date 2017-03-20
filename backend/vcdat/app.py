import os
import tempfile
import logging
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
    if app.debug:
        path = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..', 'frontend/src/'))
        with open(os.path.join(path, "index.html")) as ind:
            index = ind.read()
            return index.format(vcs_js_server=app.config["vcs_server"])
    else:
        import pkg_resources
        # Serve using pkg_resources
        return pkg_resources.resource_string(__name__, "resources/index.html").format(vcs_js_server=app.config["vcs_server"])


@app.route("/deps/<path:path>")
def serve_resource_file(path):
    if app.debug:
        dir_path = os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', '..', 'frontend/'))
        if path in ['Styles.css', 'jquery-2.2.4.min.js', 'jquery-ui.min.js', 'jquery-ui.min.css', 'clt_image.png', 'bootstrap-themed.min.css', 'add_plot.svg']:
            return send_from_directory(dir_path, 'deps/' + path)
        if path in ['Bundle.js', 'Bundle.js.map']:
            return send_from_directory(dir_path, 'dist/' + path)
    else:
        import pkg_resources
        # Serve using pkg_resources

        if path.endswith("css"):
            mimetype = "text/css"
        elif path.endswith("js"):
            mimetype = "text/javascript"
        elif path.endswith("png"):
            mimetype = "image/png"
        elif path.endswith("svg"):
            mimetype = "image/svg"
        else:
            mimetype = "text/plain"

        return Response(pkg_resources.resource_string(__name__, "resources/" + path), mimetype=mimetype)


@app.route("/getTemplates")
@jsonresp
def get_templates():
    templates = get_t()
    return json.dumps(templates)

  
@app.route("/plotTemplate")
def plot_template():
    tmpl = json.loads(request.args["tmpl"])
    t = templ_from_json(tmpl)
    canvas = vcs.init(bg=True)
    g = vcs.createboxfill()
    g.xmtics1 = {.5 * i: "" for i in range(1,20,2)}
    g.xmtics2 = g.xmtics1
    g.ymtics1 = g.xmtics1
    g.ymtics2 = g.xmtics1
    ticlabels = {i: str(i) for i in range(10)}
    g.xticlabels1 = ticlabels
    g.yticlabels1 = ticlabels
    g.yticlabels2 = ticlabels
    g.xticlabels2 = ticlabels
    v = [[0] * 10] * 10
    v = cdms2.tvariable.TransientVariable(v)

    t.plot(canvas, v, g)
    if t.legend.priority:
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


@app.route("/getInitialFileTree")
@jsonresp
def get_initial_file_tree():
    start_path = os.path.expanduser('~')
    base_files = getFilesObject(start_path)
    return json.dumps(base_files)


@app.route("/browseFiles")
@jsonresp
def browse_files():
    start_path = request.args.get('path') + '/'
    file_obj = getFilesObject(start_path)
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
    # We'll upgrade this to have real provenance at some point.
    # For now, we're just doing straight reads.
    path = request.args.get('path')
    varname = request.args.get('varname')
    return json.dumps({"uri": path, "variable": varname})


if __name__ == "__main__":   # pragma: no cover
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--prod", dest="production", action="store_true")
    parser.add_argument("--port", default=5000)
    parser.add_argument("--vcs_server")

    args = parser.parse_args()
    app.config["vcs_server"] = args.vcs_server
    app.run(debug=(not args.production), port=int(args.port))
