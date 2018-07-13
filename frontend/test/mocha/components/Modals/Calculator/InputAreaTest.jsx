/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var React = require("react");

import InputArea from "../../../../../src/js/components/modals/Calculator/InputArea.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";
import sinon from "sinon";

// React-dnd is wrapping our component. This unwraps it.
const PureInputArea = InputArea.DecoratedComponent;

const getProps = () => {
    return {
        connectDropTarget: identity
    };
};

// A dummy function so react-dnd doesn't complain
const identity = el => el;

describe("InputAreaTest.jsx", function() {
    it("renders without exploding", () => {
        let props = getProps();
        let input_area = shallow(<PureInputArea {...props} />);
        expect(input_area).to.have.lengthOf(1);
    });
});
