import vcs
import json

_templates = {}

def get_t():
        for tname in vcs.elements['template'].keys():
            _templates[tname] = vcs.utils.dumpToDict(vcs.elements['template'][tname])[0]
        return _templates
