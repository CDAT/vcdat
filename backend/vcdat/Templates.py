import vcs
import json

def templ_from_json(blob):
    t = vcs.createtemplate()
    for a in blob:
        if isinstance(blob[a], dict):
            attr = getattr(t, a)
            for k in blob[a]:
                setattr(attr, k, blob[a][k])
    return t
