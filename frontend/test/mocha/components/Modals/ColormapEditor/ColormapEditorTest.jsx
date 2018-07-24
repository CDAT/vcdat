/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var React = require("react");

import ColormapEditor from "../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx";
// import { PureColormapEditor } from '../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx'
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";
import { createMockStore } from "redux-test-utils";
import sinon from "sinon";

describe("ColormapEditorTest.jsx", function() {
    const props = {
        show: true,
        close: function() {
            return true;
        }
    };

    const state = {
        present: {
            graphics_methods: {
                boxfill: {
                    default: {}
                }
            },
            sheets_model: {
                row_count: 1,
                col_count: 1,
                sheets: [
                    {
                        cells: [
                            [
                                {
                                    plots: [
                                        {
                                            graphics_method_parent: "boxfill",
                                            graphics_method: "default"
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                ],
                selected_cell_id: "0_0_0",
                cur_sheet_index: 0
            },
            colormaps: {
                viridis: [
                    [100, 100, 100, 100], // 3 cells total
                    [70, 70, 70, 100],
                    [40, 40, 40, 100]
                ],
                testSelect: [[0, 0, 0, 100], [70, 70, 70, 100], [100, 100, 100, 100]]
            }
        }
    };

    it("renders without exploding", () => {
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} {...props} />);
        expect(colormap_editor).to.have.lengthOf(1);
    });

    it("handleChange updates color state", () => {
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} {...props} />).dive();
        colormap_editor.setState({
            current_colormap: [[100, 100, 100, 100], [70, 70, 70, 100], [40, 40, 40, 100]],
            selected_cells_start: 0,
            selected_cells_end: 0
        });
        const color = {
            rgb: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        colormap_editor.instance().handleChange(color);
        expect(colormap_editor.state().current_colormap[0][0]).to.equal(color.rgb.r);
        expect(colormap_editor.state().current_colormap[0][1]).to.equal(color.rgb.g);
        expect(colormap_editor.state().current_colormap[0][2]).to.equal(color.rgb.b);
        expect(colormap_editor.state().currentColor.rgb.r).to.equal(color.rgb.r);
        expect(colormap_editor.state().currentColor.rgb.g).to.equal(color.rgb.g);
        expect(colormap_editor.state().currentColor.rgb.g).to.equal(color.rgb.b);
    });

    it("Opens and closes the ImportExportModal", () => {
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} {...props} />).dive();
        // redux is wrapped around this component. use dive to get around it
        expect(colormap_editor.state().show_import_export_modal).to.be.false;

        colormap_editor.instance().openImportExportModal();
        expect(colormap_editor.state().show_import_export_modal).to.be.true;

        colormap_editor.instance().closeImportExportModal();
        expect(colormap_editor.state().show_import_export_modal).to.be.false;
    });

    it("Opens the new colormap modal", () => {
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} {...props} />).dive();
        expect(colormap_editor.state().show_new_colormap_modal).to.be.false;
        colormap_editor.instance().handleOpenNewColormapModal();
        expect(colormap_editor.state().show_new_colormap_modal).to.be.true;
    });

    it("handleCellClick selects cells and sets color", () => {
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} {...props} />).dive();

        expect(colormap_editor.state().selected_cells_start).to.equal(-1);
        expect(colormap_editor.state().selected_cells_end).to.equal(-1);

        colormap_editor.instance().handleCellClick(2, 2);

        expect(colormap_editor.state().selected_cells_start).to.equal(2);
        expect(colormap_editor.state().selected_cells_end).to.equal(2);
        expect(colormap_editor.state().currentColor.rgb.r).to.equal(102); // colormaps use 0-100, color object uses 0-255
        expect(colormap_editor.state().currentColor.rgb.g).to.equal(102); // we input 40% which comes out as 102/255
        expect(colormap_editor.state().currentColor.rgb.b).to.equal(102);
    });

    it("Loads the selected colormap", () => {
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} {...props} />).dive();

        colormap_editor.instance().handleSelectColormap("testSelect");
        expect(colormap_editor.state().current_colormap[0][0]).to.equal(0); // first cell red should be 0
        expect(colormap_editor.state().current_colormap[1][0]).to.equal(70); // second cell red should be 70
        expect(colormap_editor.state().current_colormap[2][0]).to.equal(100); // third cell red should be 100
    });

    it("Deletes a colormap properly", () => {
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} {...props} />).dive();
        let warn = console.warn;
        console.warn = function() {
            return;
        }; // disable console.warn to prevent unnecessary warnings about vcs being missing
        const confirm = sinon.stub(global, "confirm");
        confirm.returns(true);
        global.vcs = {
            removecolormap() {
                return Promise.resolve();
            }
        };

        colormap_editor.instance().handleSelectColormap("testSelect");
        colormap_editor.instance().handleDeleteColormap("testSelect");
        expect(colormap_editor.state().selected_colormap_name).to.equal("viridis"); // since it is the only colormap left, viridis should be selected
        for (let cell = 0; cell < 3; cell++) {
            for (let color_index = 0; color_index < 3; color_index++) {
                expect(colormap_editor.state().current_colormap[cell][color_index]).to.equal(state.present.colormaps.viridis[cell][color_index]);
            }
        }
        console.warn = warn; // restore console.warn
        confirm.restore();
    });

    it("Blends a colormap properly", () => {
        var blend_state = {
            present: {
                sheets_model: {
                    sheets: [{ row_count: 1, col_count: 1 }],
                    selected_cell_id: "0_0_0",
                    cur_sheet_index: 0
                },
                colormaps: {
                    viridis: [
                        // viridis will be loaded by default. Change the values here to something we can blend
                        [0, 0, 0, 100], // 3 cells total
                        [0, 0, 0, 100], // this cell will be blended to [50, 50, 50]
                        [100, 100, 100, 100]
                    ]
                }
            }
        };
        const store = createMockStore(blend_state);
        const colormap_widget = shallow(<ColormapEditor store={store} {...props} />).dive();
        colormap_widget.setState({
            selected_cells_start: 0,
            selected_cells_end: 2
        });
        colormap_widget.instance().blendColors();
        let blended_values = [0, 50, 100];
        for (let cell = 0; cell < 3; cell++) {
            for (let color_index = 0; color_index < 3; color_index++) {
                expect(colormap_widget.state().current_colormap[cell][color_index]).to.equal(blended_values[cell]);
            }
        }
    });

    it("Resets a colormap properly", () => {
        const store = createMockStore(state);
        const colormap_widget = shallow(<ColormapEditor store={store} {...props} />).dive();
        colormap_widget.instance().handleSelectColormap("testSelect");
        const color = {
            rgb: {
                r: 41,
                g: 41,
                b: 41
            }
        };
        colormap_widget.setState({ selected_cells_start: 1, selected_cells_end: 1 });
        colormap_widget.instance().handleChange(color);
        expect(colormap_widget.state().current_colormap[1][0]).to.equal(16);
        expect(colormap_widget.state().current_colormap[1][1]).to.equal(16);
        expect(colormap_widget.state().current_colormap[1][2]).to.equal(16);
        colormap_widget.instance().resetColormap();
        for (let cell = 0; cell < 3; cell++) {
            for (let color_index = 0; color_index < 3; color_index++) {
                expect(colormap_widget.state().current_colormap[cell][color_index]).to.equal(state.present.colormaps.testSelect[cell][color_index]);
            }
        }
    });

    it("Helper function for new colormaps calls expected functions", () => {
        const dummy_cm = [1, 2, 3];
        global.vcs = {
            createcolormap: sinon.stub().resolves(dummy_cm)
        };
        let spy = sinon.spy();
        const store = createMockStore(state);
        const colormap_editor = shallow(<ColormapEditor store={store} saveColormap={spy} {...props} />).dive();
        return colormap_editor
            .instance()
            .createNewColormapInVcs(dummy_cm, "test")
            .then(
                () => {
                    expect(global.vcs.createcolormap.calledWith("test", dummy_cm)).to.be.true;
                },
                () => {
                    assert(false);
                }
            );
    });

    it("saves a colormap", () => {
        const store = createMockStore(state);
        let dummy_save = sinon.spy();
        global.vcs = {
            setcolormap: sinon.stub().resolves()
        };
        const colormap_widget = shallow(<ColormapEditor store={store} saveColormap={dummy_save} {...props} />).dive();
        colormap_widget.setState({ current_colormap: [1, 2, 3] });
        colormap_widget.setProps({ saveColormap: dummy_save }); //
        return colormap_widget
            .instance()
            .saveColormap("name")
            .then(
                () => {
                    expect(dummy_save.calledOnce).to.be.true;
                    expect(dummy_save.calledWith("name", [1, 2, 3])).to.be.true;
                    // dummy save represents the call to redux to save the colormap
                },
                () => {
                    // Should not error. assert false to catch if it does
                    assert(false);
                }
            );
    });

    it("rejects gracefully when saving if vcs is not defined", () => {
        const store = createMockStore(state);
        let dummy_save = sinon.spy();
        let warn = console.warn;
        console.warn = () => {};
        delete global.vcs;
        const colormap_widget = shallow(<ColormapEditor store={store} saveColormap={dummy_save} {...props} />).dive();
        colormap_widget.setState({ current_colormap: [1, 2, 3] });
        return colormap_widget
            .instance()
            .saveColormap("name")
            .then(
                () => {
                    assert(false);
                    console.warn = warn;
                },
                () => {
                    assert(true);
                    console.warn = warn;
                }
            );
    });

    it("rejects a save if no name is given", () => {
        const store = createMockStore(state);
        let dummy_save = sinon.spy();
        delete global.vcs;
        const colormap_widget = shallow(<ColormapEditor store={store} saveColormap={dummy_save} {...props} />).dive();
        colormap_widget.setState({ current_colormap: [1, 2, 3] });
        return colormap_widget
            .instance()
            .saveColormap("")
            .then(
                () => {
                    assert(false);
                },
                () => {
                    assert(true);
                }
            );
    });

    it("Applies a colormap correctly", () => {
        global.vcs = {
            getcolormapnames: function() {
                return new Promise(resolve => {
                    resolve(["default", "viridis", "testSelect"]);
                });
            },
            setcolormap: function() {
                return new Promise(resolve => {
                    resolve("");
                });
            },
            createcolormap: function() {
                return new Promise(resolve => {
                    resolve("");
                });
            }
        };

        let spies = {
            saveColormap: sinon.spy(),
            updateGraphicsMethod: sinon.spy(),
            applyColormap: sinon.spy()
        };
        const store = createMockStore(state);
        const colormap_widget = shallow(<ColormapEditor store={store} {...props} />).dive();
        colormap_widget.setProps({
            saveColormap: spies.saveColormap,
            updateGraphicsMethod: spies.updateGraphicsMethod,
            applyColormap: spies.applyColormap
        });
        return colormap_widget
            .instance()
            .handleApplyColormap()
            .then(() => {
                sinon.assert.called(spies.updateGraphicsMethod);
                sinon.assert.called(spies.applyColormap);
            });
    });
});
