/* globals it, describe, before, beforeEach, */
var chai = require("chai");
var expect = chai.expect;
var React = require("react");

import { PureCalculator as Calculator, CALC_TYPES } from "../../../../../src/js/components/modals/Calculator/Calculator.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";
import sinon from "sinon";

const getProps = () => {
    return {
        show: true,
        close: sinon.spy(),
        variables: {
            clt: {
                cdms_var_name: "clt",
                axisList: ["time", "latitude", "longitude"],
                filename: {
                    directory: false,
                    name: "clt.nc",
                    path: "/Users/username/sample_data//",
                    subItems: {}
                },
                path: "/Users/username/sample_data/clt.nc",
                dimension: [
                    {
                        axisName: "time"
                    },
                    {
                        axisName: "latitude"
                    },
                    {
                        axisName: "longitude"
                    }
                ],
                transforms: {}
            },
            u: {
                cdms_var_name: "u",
                axisList: ["time1", "plev", "latitude1", "longitude1"],
                filename: {
                    directory: false,
                    name: "clt.nc",
                    path: "/Users/username/sample_data//",
                    subItems: {}
                },
                path: "/Users/username/sample_data/clt.nc",
                dimension: [
                    {
                        axisName: "time1"
                    },
                    {
                        axisName: "plev"
                    },
                    {
                        axisName: "latitude1"
                    },
                    {
                        axisName: "longitude1"
                    }
                ],
                transforms: {}
            },
            v: {
                cdms_var_name: "v",
                axisList: ["time2", "plev1", "latitude2", "longitude2"],
                filename: {
                    directory: false,
                    name: "clt.nc",
                    path: "/Users/username/sample_data//",
                    subItems: {}
                },
                path: "/Users/username/sample_data/clt.nc",
                dimension: [
                    {
                        axisName: "time2"
                    },
                    {
                        axisName: "plev1"
                    },
                    {
                        axisName: "latitude2"
                    },
                    {
                        axisName: "longitude2"
                    }
                ],
                transforms: {}
            },
            clt_plus_2: {
                dimension: [],
                transforms: [],
                json: "".concat(
                    '{"derivation": [{"attribute_values": {"value": 2}, "node_type": "raw", "dependent_attributes": [], ',
                    '"node_params": {"value": "Raw (JSON-compatible) value provided by this node."}}, ',
                    '{"attribute_values": {"objtype": "variable", "uri": "/Users/username/sample_data/clt.nc", "objid": "clt"}, ',
                    '"node_type": "dataset", "dependent_attributes": [], "node_params": {"objtype": "Type of object to retrieve.", ',
                    '"uri": "URI for a dataset", "objid": "id of the object to retrieve"}}, {"attribute_values": ',
                    '{"operator": "+", "left_value": 1, "right_value": 0}, "node_type": "arithmetic", "dependent_attributes": ',
                    '["left_value", "right_value"], "node_params": {"operator": "Operator used for data transform", ',
                    '"left_value": "Left-hand side of a binary operator", "right_value": "Right-hand side of a binary operator"}}]}'
                )
            }
        },
        variable_names: ["clt", "u", "v", "clt_plus_2"],
        removeVariable: sinon.spy(),
        loadVariable: sinon.spy()
    };
};

describe("CalculatorTest.jsx", function() {
    it("renders without exploding", () => {
        let props = getProps();
        let calculator = shallow(<Calculator {...props} />);
        expect(calculator).to.have.lengthOf(1);
    });

    it("setInputFocus sets input_focus in state", () => {
        let props = getProps();
        let calculator = shallow(<Calculator {...props} />);
        expect(calculator.state().input_focus).to.equal(false);
        calculator.instance().setInputFocus(true);
        expect(calculator.state().input_focus).to.equal(true);
        calculator.instance().setInputFocus(false);
        expect(calculator.state().input_focus).to.equal(false);
    });

    it("handleNewVariableName sets new_variable_name in state", () => {
        let props = getProps();
        let event = {
            target: {
                value: "newName"
            }
        };
        let calculator = shallow(<Calculator {...props} />);
        expect(calculator.state().new_variable_name).to.equal("");
        calculator.instance().handleNewVariableName(event);
        expect(calculator.state().new_variable_name).to.equal(event.target.value);
    });

    it("handleVariable sets left side", () => {
        let props = getProps();
        let variable = {
            name: "new_var"
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.instance().handleVariable(variable);
        expect(calculator.state().calculation_left_side).to.deep.equal({
            value: variable.name,
            type: CALC_TYPES.var
        });
    });

    it("handleVariable sets right side", () => {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let operator = "+";
        let variable = {
            name: "new_var"
        };
        let calculator = shallow(<Calculator {...props} />);
        // Left side and operator must be set for a second variable to be registered
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator
        });
        calculator.instance().handleVariable(variable);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal({
            value: variable.name,
            type: CALC_TYPES.var
        });
    });

    it("handleVariable does not set right side if the operator is unary", () => {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let operator = "~";
        let variable = {
            name: "new_var"
        };
        let calculator = shallow(<Calculator {...props} />);
        let right_side = calculator.state().calculation_right_side;
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator
        });
        calculator.instance().handleVariable(variable);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);
    });

    it("handleVariable does not set right side if there is no operator", () => {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let variable = {
            name: "new_var"
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side
        });
        let operator = calculator.state().calculation_operator;
        let right_side = calculator.state().calculation_right_side;
        calculator.instance().handleVariable(variable);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);
    });

    it("handleConstant sets left side", function() {
        let props = getProps();
        let number = 2;
        let calculator = shallow(<Calculator {...props} />);
        calculator.instance().handleConstant(number);
        expect(calculator.state().calculation_left_side).to.deep.equal({
            value: number.toString(),
            type: CALC_TYPES.const
        });
    });

    it("handleConstant appends to left side constant when there is no operator", function() {
        let props = getProps();
        let number = 2;
        let left_side = {
            value: "1", // must be a string
            type: CALC_TYPES.const
        };
        let calculator = shallow(<Calculator {...props} />);

        calculator.setState({
            calculation_left_side: left_side
        });
        calculator.instance().handleConstant(number);

        expect(calculator.state().calculation_left_side).to.deep.equal({
            value: left_side.value + number.toString(),
            type: CALC_TYPES.const
        });
    });

    it("handleConstant does not change state when left side is a variable and no operator is set", function() {
        let props = getProps();
        let number = 2;
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side
        });
        let state_before = calculator.state();

        calculator.instance().handleConstant(number);
        expect(calculator.state()).to.deep.equal(state_before);
    });

    it("handleConstant should not change state when the left side is set with a unary operator", function() {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let operator = "~";
        let number = 2;
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator
        });
        calculator.instance().handleConstant(number);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
    });

    it("handleConstant sets right side", function() {
        let props = getProps();
        let number = 2;
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let operator = "+";
        let calculator = shallow(<Calculator {...props} />);

        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator
        });
        calculator.instance().handleConstant(number);
        expect(calculator.state().calculation_right_side).to.deep.equal({
            value: number.toString(),
            type: CALC_TYPES.const
        });

        number = "2";
        calculator.instance().handleConstant(number);

        expect(calculator.state().calculation_right_side).to.deep.equal({
            value: number.toString() + number.toString(),
            type: CALC_TYPES.const
        });
    });

    it("handleConstant handles a full calculation", function() {
        let props = getProps();
        let number = 2;
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let operator = "+";
        let right_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let calculator = shallow(<Calculator {...props} />);

        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator,
            calculation_right_side: right_side
        });
        calculator.instance().handleConstant(number);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);

        number = "2";
        calculator.instance().handleConstant(number);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);
    });

    it("handleClear sets state to undefined or empty string", () => {
        let props = getProps();
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let operator = "+";
        let right_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let new_variable_name,
            placeholder = "example";
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            new_variable_name: new_variable_name,
            calculation_left_side: left_side,
            calculation_operator: operator,
            calculation_right_side: right_side,
            placeholder_text: placeholder
        });
        expect(calculator.state().new_variable_name).to.deep.equal(new_variable_name);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);
        expect(calculator.state().placeholder_text).to.deep.equal(placeholder);

        calculator.instance().handleClear();

        expect(calculator.state().new_variable_name).to.deep.equal("");
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
        expect(calculator.state().calculation_right_side).to.deep.equal(undefined);
        expect(calculator.state().placeholder_text).to.deep.equal("");
    });

    it("handleDelete deletes from right side constants", () => {
        let props = getProps();
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let operator = "+";
        let right_side = {
            value: "22",
            type: CALC_TYPES.const
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator,
            calculation_right_side: right_side
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);

        calculator.instance().handleDelete();

        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side.value).to.equal("2");

        calculator.instance().handleDelete();

        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(undefined);
    });

    it("handleDelete deletes from right side variables", () => {
        let props = getProps();
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let operator = "+";
        let right_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator,
            calculation_right_side: right_side
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);

        calculator.instance().handleDelete();

        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(undefined);
    });

    it("handleDelete deletes an operator if the right side is not defined", () => {
        let props = getProps();
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let operator = "+";
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);

        calculator.instance().handleDelete();

        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
    });

    it("handleDelete deletes left side constants if operator is not defined", () => {
        let props = getProps();
        let left_side = {
            value: "22",
            type: CALC_TYPES.const
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);

        calculator.instance().handleDelete();

        expect(calculator.state().calculation_left_side.value).to.equal("2");

        calculator.instance().handleDelete();

        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
    });

    it("handleDelete deletes left side variable if operator is not defined", () => {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        calculator.instance().handleDelete();
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
    });

    it("handleDelete deletes left side variable if operator is not defined", () => {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        calculator.instance().handleDelete();
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
    });

    it("handleoperator does not override existing operators", () => {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let old_operator = "+";
        let new_operator = "-";
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: old_operator
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(old_operator);
        calculator.instance().handleOperator(new_operator);
        expect(calculator.state().calculation_operator).to.deep.equal(old_operator);
    });

    it("handleoperator adds a unary operator even if the left side is undefined", () => {
        let props = getProps();
        let left_side = {
            value: "clt",
            type: CALC_TYPES.var
        };
        let operator = "~";
        let calculator = shallow(<Calculator {...props} />);
        // Check that operator is added when the left side is undefined
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
        calculator.instance().handleOperator(operator);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);

        // Now check that operator is added with the left side defined
        calculator.instance().handleClear();
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
        calculator.setState({
            calculation_left_side: left_side
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        calculator.instance().handleOperator(operator);
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
    });
});
