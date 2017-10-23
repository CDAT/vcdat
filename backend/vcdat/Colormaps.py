import vcs


def get_cmaps():
    cmaps = {}
    for cmap in vcs.listelements('colormap'):
        index = vcs.getcolormap(cmap).index
        cmaps[cmap] = [vcs.getcolormap(cmap).getcolorcell(i) for i in range(256)]
    return cmaps
