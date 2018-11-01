import vcs


def get_cmaps():
    cmaps = {}
    for cmap in vcs.listelements('colormap'):
        index = vcs.getcolormap(cmap).index
        cmaps[cmap] = [vcs.getcolormap(cmap).getcolorcell(i) for i in range(256)]
    return cmaps



def export_colormap(colormap_name , file_path="/tmp/test_export"):
    if colormap_name in vcs.listelements('colormap'):
        output = vcs.getcolormap(colormap_name)
        try:
            output.script(file_path, "w")
        except:
            raise
        else:
            return "Exported colormap {} to {}".format(colormap_name, file_path)
