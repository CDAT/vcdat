/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var React = require("react");

import CalculatorButtons from "../../../../../src/js/components/modals/Calculator/CalculatorButtons.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";

const getProps = () => {
    return {};
};

describe("CalculatorButtonsTest.jsx", function() {
    it("renders without exploding", () => {
        let props = getProps();
        let calculator_buttons = shallow(<CalculatorButtons {...props} />);
        expect(calculator_buttons).to.have.lengthOf(1);
    });
});
