/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var React = require("react");

import VariableList from "../../../../../src/js/components/modals/Calculator/VariableList.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";
import sinon from "sinon";

const getProps = () => {
    return {
        variables: ["clt", "u", "v"]
    };
};

describe("VariableListTest.jsx", function() {
    it("renders without exploding", () => {
        let props = getProps();
        let variable_list = shallow(<VariableList {...props} />);
        expect(variable_list).to.have.lengthOf(1);
    });
});
