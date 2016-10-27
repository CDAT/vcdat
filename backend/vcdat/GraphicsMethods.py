import vcs
import json

_2d_methods = ('scatter', 'vector', 'xvsy', 'stream', 'glyph', '3d_vector', '3d_dual_scalar')
_primitives = ('line', 'marker', 'fillarea', 'text')


def get_gm():
    _methods = {}
    for t in vcs.graphicsmethodlist():
        _methods[t] = {}
        for m in vcs.elements[t].keys():
            _methods[t][m] = vcs.dumpToDict(vcs.elements[t][m])[0]
    return _methods


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
