import vcs
import json

_templates = {}


def get_t():
        for tname in vcs.elements['template'].keys():
            _templates[tname] = vcs.utils.dumpToDict(vcs.elements['template'][tname])[0]
        return _templates


def templ_from_json(blob):
    t = vcs.createtemplate()
    for a in blob:
        if isinstance(blob[a], dict):
            attr = getattr(t, a)
            for k in blob[a]:
                setattr(attr, k, blob[a][k])
    return t
