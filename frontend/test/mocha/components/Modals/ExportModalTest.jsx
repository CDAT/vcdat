/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var React = require("react");

import ExportModal from "../../../../src/js/components/modals/ExportModal.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";

const getProps = () => {
    return {
        show: true,
        close: () => {}
    };
};

describe("ExportModalTest.jsx", function() {
    it("renders without exploding", () => {
        const props = getProps();
        var export_modal = shallow(<ExportModal {...props} />);
        expect(export_modal).to.have.lengthOf(1);
    });
});