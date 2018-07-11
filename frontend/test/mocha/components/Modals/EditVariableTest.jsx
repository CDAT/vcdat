/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var React = require("react");

import { PureEditVariable as EditVariable } from "../../../../src/js/components/modals/EditVariable.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";
import sinon from "sinon";
import $ from "jquery";

const props = {
    show: true,
    onTryClose: sinon.spy(),
    variables: {
        clt: {
            axisList: ["time", "latitude", "longitude"],
            cdms_var_name: "test",
            dimension: [{ axisName: "time" }, { axisName: "latitude" }, { axisName: "longitude" }],
            path: "dummy/path/test.nc"
        }
    },
    active_variable: "clt",
    updateVariable: sinon.spy()
};

const dummy_vcs = {
    variables: function() {
        return Promise.resolve([
            {
                clt: {
                    gridType: "rectilinear",
                    name: "Total cloudiness",
                    axisList: ["time", "latitude", "longitude"],
                    bounds: null,
                    shape: [10, 5, 5],
                    lonLat: null,
                    units: "%"
                }
            },
            {
                longitude: {
                    units: "degrees_east",
                    shape: [5],
                    data: [-180, -175, -170, -165, -160],
                    name: "longitude"
                },
                time: {
                    units: "months since 1979-1-1 0",
                    shape: [10],
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    name: "time"
                },
                latitude: {
                    units: "degrees_north",
                    shape: [5],
                    data: [-90, -86, -82, -78, -74],
                    name: "latitude"
                }
            }
        ]);
    }
};

describe("EditVariableTest.jsx", function() {
    it("Renders without exploding", () => {
        global.vcs = dummy_vcs;
        var edit_variable = shallow(<EditVariable {...props} />);
        expect(edit_variable).to.have.lengthOf(1);
        let props_off = $.extend(true, { show: false }, props);
        edit_variable = shallow(<EditVariable {...props_off} />);
        expect(edit_variable).to.have.lengthOf(1);
    });

    it("Handles dimension value changes", () => {
        const edit_variable = shallow(<EditVariable {...props} />);
        edit_variable.setState({
            dimension: [{ axisName: "time" }, { axisName: "latitude" }, { axisName: "longitude" }]
        });
        edit_variable.instance().handleDimensionValueChange({ range: [1, 9], stride: 1 }, "time");
        expect(edit_variable.state().dimension[0].values.range[0]).to.equal(1);
        expect(edit_variable.state().dimension[0].values.range[1]).to.equal(9);
        expect(edit_variable).to.have.lengthOf(1);
    });

    it("Saves and closes", () => {
        const edit_variable = shallow(<EditVariable {...props} />);
        edit_variable.find("#edit-var-save").simulate("click");
        expect(props.updateVariable.calledOnce).to.be.true;
        expect(props.onTryClose.calledOnce).to.be.true;
        edit_variable.find("#edit-var-close").simulate("click");
        expect(props.onTryClose.callCount).to.equal(2);
    });
});
