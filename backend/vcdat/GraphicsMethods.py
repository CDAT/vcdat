import vcs
import json
import numpy

_ = vcs.init()
_methods = {}
_2d_methods = ('scatter', 'vector', 'xvsy', 'stream', 'glyph', '3d_vector', '3d_dual_scalar')
_primitives = ('line', 'marker', 'fillarea', 'text')


def get_gm():
    for t in vcs.graphicsmethodlist():
        _methods[t] = {}
        for m in vcs.elements[t].keys():
            gm = vcs.elements[t][m]
            _methods[t][m] = vcs.dumpToDict(gm)[0]
            if hasattr(gm, "levels"):
                arr = numpy.array(gm.levels)
                if numpy.allclose(arr, 1e20) and arr.shape[-1] == 2:
                    _methods[t][m]["levels"] = [1e20, 1e20]
    return _methods

def get_default_gms():
    _defaults = {}
    for t in vcs.graphicsmethodlist():
        _defaults[t] = vcs.elements[t].keys()
    return _defaults

def detect_nvars(g_type, g_method, g_obj):
    """Try to return the number of variables required for the plot method.
    Returns the number of variables required by the plot type.
    This isn't really exposed by vcs, so this is written by following this
    insanity:
    https://github.com/UV-CDAT/uvcdat/blob/master/Packages/vcs/Lib/Canvas.py#L251
    The reality is that this api will need to be more complicated in the
    future to account some methods (like meshfill) that can take one or two
    variables depending on the grid.
    """
    g_type = g_type.lower()

    # first check for g_naslabs
    if hasattr(g_obj, 'g_nslabs'):
        return g_obj.g_nslabs

    # then check methods that require 2 variables
    if g_type in _2d_methods:
        return 2

    # meshfill takes one or two, but there are extra requirements that we will
    # have to pass through the api once they are understood
    if g_type == 'meshfill':
        return 1

    # low level primitives should probably not happen
    if g_type in _primitives:
        return 0

    # 1d takes 2 variables
    if g_type == '1d':
        return 2

    # otherwise assume 1
    return 1
