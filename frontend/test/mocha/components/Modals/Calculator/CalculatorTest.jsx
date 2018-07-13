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

    it("handleoperator does not add a binary operator if the left side is undefined", () => {
        let props = getProps();
        let operator = "+";
        let calculator = shallow(<Calculator {...props} />);
        // Check that operator is added when the left side is undefined
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
        calculator.instance().handleOperator(operator);
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
    });

    it("handleoperator will not set a new operator if the calculation is full", () => {
        let props = getProps();
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let set_operator = "+";
        let new_operator = "-";
        let right_side = {
            value: "2",
            type: CALC_TYPES.const
        };
        let calculator = shallow(<Calculator {...props} />);
        // Check that operator is added when the left side is undefined
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
        expect(calculator.state().calculation_right_side).to.deep.equal(undefined);
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: set_operator,
            calculation_right_side: right_side
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(set_operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);

        calculator.instance().handleOperator(new_operator);

        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(set_operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(right_side);
    });

    it("handleoperator adds an operation when the left side is defined", () => {
        let props = getProps();
        let left_side = {
            value: "1",
            type: CALC_TYPES.const
        };
        let operator = "+";
        let calculator = shallow(<Calculator {...props} />);
        // Check that operator is added when the left side is undefined
        expect(calculator.state().calculation_left_side).to.deep.equal(undefined);
        expect(calculator.state().calculation_operator).to.deep.equal(undefined);
        expect(calculator.state().calculation_right_side).to.deep.equal(undefined);
        calculator.setState({
            calculation_left_side: left_side,
            calculation_operator: operator
        });
        expect(calculator.state().calculation_left_side).to.deep.equal(left_side);
        expect(calculator.state().calculation_operator).to.deep.equal(operator);
        expect(calculator.state().calculation_right_side).to.deep.equal(undefined);
    });

    let test_cases = [
        { left: undefined, operator: undefined, right: undefined, expected: "" },
        { left: { value: "1", type: CALC_TYPES.const }, operator: undefined, right: undefined, expected: "1" },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: undefined, expected: "1 +" },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "2", type: CALC_TYPES.const }, expected: "1 + 2" },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "-", right: { value: "clt", type: CALC_TYPES.var }, expected: "1 - clt" },
        { left: { value: "clt", type: CALC_TYPES.var }, operator: "/", right: { value: "2", type: CALC_TYPES.const }, expected: "clt / 2" },
        { left: { value: "u", type: CALC_TYPES.var }, operator: "*", right: { value: "v", type: CALC_TYPES.var }, expected: "u * v" }
    ];

    test_cases.forEach(function(test_case, index) {
        it(`printCalculation works with case ${index}`, function() {
            let props = getProps();
            let calculator = shallow(<Calculator {...props} />);
            calculator.setState({
                calculation_left_side: test_case.left,
                calculation_operator: test_case.operator,
                calculation_right_side: test_case.right
            });
            let result = calculator.instance().printCalculation();
            expect(result).to.equal(test_case.expected);
        });
    });

    test_cases = [
        { left: undefined, operator: undefined, right: undefined, expected: false }, // no args -> false
        { left: { value: "1", type: CALC_TYPES.const }, operator: undefined, right: undefined, expected: false }, // 1 arg no op -> false
        { left: { value: "clt", type: CALC_TYPES.var }, operator: undefined, right: undefined, expected: false }, // 1 arg no op -> false
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: undefined, expected: false }, // 1 arg, binary -> false
        { left: { value: "clt", type: CALC_TYPES.var }, operator: "+", right: undefined, expected: false }, // 1 arg, binary -> false
        { left: { value: "1", type: CALC_TYPES.const }, operator: "~", right: undefined, expected: true }, // 1 arg, unary -> true
        { left: { value: "clt", type: CALC_TYPES.var }, operator: "~", right: undefined, expected: true }, // 1 arg, unary -> true
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "2", type: CALC_TYPES.const }, expected: true },
        { left: { value: "clt", type: CALC_TYPES.var }, operator: "+", right: { value: "2", type: CALC_TYPES.const }, expected: true },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "u", type: CALC_TYPES.var }, expected: true },
        { left: { value: "clt", type: CALC_TYPES.var }, operator: "+", right: { value: "u", type: CALC_TYPES.var }, expected: true },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "~", right: { value: "2", type: CALC_TYPES.const }, expected: false },
        { left: { value: "clt", type: CALC_TYPES.var }, operator: "~", right: { value: "2", type: CALC_TYPES.const }, expected: false },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "~", right: { value: "u", type: CALC_TYPES.var }, expected: false },
        { left: { value: "clt", type: CALC_TYPES.var }, operator: "~", right: { value: "u", type: CALC_TYPES.var }, expected: false }
    ];
    test_cases.forEach(function(test_case, index) {
        it(`isValidCalculation works with case ${index}`, function() {
            let props = getProps();
            let calculator = shallow(<Calculator {...props} />);
            calculator.setState({
                calculation_left_side: test_case.left,
                calculation_operator: test_case.operator,
                calculation_right_side: test_case.right
            });
            let result = calculator.instance().isValidCalculation();
            expect(result).to.equal(test_case.expected);
        });
    });

    test_cases = [
        { left: undefined, operator: undefined, right: undefined, expected: "" },
        { left: "1", operator: undefined, right: undefined, expected: "1" },
        { left: "1", operator: "/", right: undefined, expected: "1_div" },
        { left: "1", operator: "*", right: undefined, expected: "1_mult" },
        { left: "1", operator: "-", right: undefined, expected: "1_minus" },
        { left: "1", operator: "+", right: undefined, expected: "1_plus" },

        { left: "1", operator: "+", right: "2", expected: "1_plus_2" },
        { left: "1", operator: "+", right: { value: "2", type: CALC_TYPES.const }, expected: "1_plus_2" },
        { left: "1", operator: "+", right: "clt", expected: "1_plus_clt" },
        { left: "1", operator: "+", right: { value: "clt", type: CALC_TYPES.var }, expected: "1_plus_clt" },

        { left: "u", operator: "+", right: "2", expected: "u_plus_2" },
        { left: "u", operator: "+", right: { value: "2", type: CALC_TYPES.const }, expected: "u_plus_2" },
        { left: "u", operator: "+", right: "clt", expected: "u_plus_clt" },
        { left: "u", operator: "+", right: { value: "clt", type: CALC_TYPES.var }, expected: "u_plus_clt" },

        { left: { value: "v", type: CALC_TYPES.var }, operator: "+", right: "2", expected: "v_plus_2" },
        { left: { value: "v", type: CALC_TYPES.var }, operator: "+", right: { value: "2", type: CALC_TYPES.const }, expected: "v_plus_2" },
        { left: { value: "v", type: CALC_TYPES.var }, operator: "+", right: "clt", expected: "v_plus_clt" },
        { left: { value: "v", type: CALC_TYPES.var }, operator: "+", right: { value: "clt", type: CALC_TYPES.var }, expected: "v_plus_clt" }
    ];
    test_cases.forEach(function(test_case, index) {
        it(`getPlaceholderText works with case ${index}`, function() {
            let props = getProps();
            let calculator = shallow(<Calculator {...props} />);
            let result = calculator.instance().getPlaceholderText(test_case.left, test_case.operator, test_case.right);
            expect(result).to.equal(test_case.expected);
        });
    });

    test_cases = [
        { focus: false, event: { which: 107 }, expected: "+" },
        { focus: false, event: { which: 187, shiftKey: true }, expected: "+" },
        { focus: false, event: { which: 109 }, expected: "-" },
        { focus: false, event: { which: 189 }, expected: "-" },
        { focus: false, event: { which: 106 }, expected: "*" },
        { focus: false, event: { which: 56, shiftKey: true }, expected: "*" },
        { focus: false, event: { which: 111 }, expected: "/" },
        { focus: false, event: { which: 191 }, expected: "/" }
    ];
    test_cases.forEach(function(test_case, index) {
        it(`handleKeyDown works for basic operators. Case: ${index}`, function() {
            let props = getProps();
            let calculator = shallow(<Calculator {...props} />);
            calculator.setState({
                input_focus: test_case.focus
            });
            let stub = sinon.stub(calculator.instance(), "handleOperator").callsFake(() => {});
            calculator.instance().handleKeyDown(test_case.event);
            expect(stub.getCall(0).args[0]).to.equal(test_case.expected);
        });
    });

    test_cases = [
        { focus: false, event: { which: 48 }, expected: 0 },
        { focus: false, event: { which: 49 }, expected: 1 },
        { focus: false, event: { which: 50 }, expected: 2 },
        { focus: false, event: { which: 51 }, expected: 3 },
        { focus: false, event: { which: 52 }, expected: 4 },
        { focus: false, event: { which: 53 }, expected: 5 },
        { focus: false, event: { which: 54 }, expected: 6 },
        { focus: false, event: { which: 55 }, expected: 7 },
        { focus: false, event: { which: 56 }, expected: 8 },
        { focus: false, event: { which: 57 }, expected: 9 }
    ];
    test_cases.forEach(function(test_case, index) {
        it(`handleKeyDown works for numbers. Case: ${index}`, function() {
            let props = getProps();
            let calculator = shallow(<Calculator {...props} />);
            calculator.setState({
                input_focus: test_case.focus
            });
            let stub = sinon.stub(calculator.instance(), "handleConstant").callsFake(() => {});
            calculator.instance().handleKeyDown(test_case.event);
            expect(stub.getCall(0).args[0]).to.equal(test_case.expected);
        });
    });

    it(`handleKeyDown works for other cases.`, function() {
        let props = getProps();
        let event;
        let calculator = shallow(<Calculator {...props} />);
        calculator.setState({
            input_focus: true
        });

        let handle_delete_stub = sinon.stub(calculator.instance(), "handleDelete").callsFake(() => {});
        let handle_enter_stub = sinon.stub(calculator.instance(), "handleEnter").callsFake(() => {});
        let handle_clear_stub = sinon.stub(calculator.instance(), "handleClear").callsFake(() => {});
        let handle_operator_stub = sinon.stub(calculator.instance(), "handleOperator").callsFake(() => {});
        let handle_constant_stub = sinon.stub(calculator.instance(), "handleConstant").callsFake(() => {});

        event = { which: 49 }; // when input is focused keydown shouldn't call any functions
        calculator.instance().handleKeyDown(event);
        expect(handle_delete_stub.callCount).to.equal(0);
        expect(handle_enter_stub.callCount).to.equal(0);
        expect(handle_clear_stub.callCount).to.equal(0);
        expect(handle_operator_stub.callCount).to.equal(0);
        expect(handle_constant_stub.callCount).to.equal(0);

        calculator.setState({
            input_focus: false
        });

        event = { which: 8 }; // backspace key
        calculator.instance().handleKeyDown(event);
        expect(handle_delete_stub.callCount).to.equal(1);
        expect(handle_enter_stub.callCount).to.equal(0);
        expect(handle_clear_stub.callCount).to.equal(0);
        expect(handle_operator_stub.callCount).to.equal(0);
        expect(handle_constant_stub.callCount).to.equal(0);

        event = { which: 13 }; // enter key
        calculator.instance().handleKeyDown(event);
        expect(handle_delete_stub.callCount).to.equal(1);
        expect(handle_enter_stub.callCount).to.equal(1);
        expect(handle_clear_stub.callCount).to.equal(0);
        expect(handle_operator_stub.callCount).to.equal(0);
        expect(handle_constant_stub.callCount).to.equal(0);

        event = { which: 46 }; // delete key
        calculator.instance().handleKeyDown(event);
        expect(handle_delete_stub.callCount).to.equal(1);
        expect(handle_enter_stub.callCount).to.equal(1);
        expect(handle_clear_stub.callCount).to.equal(1);
        expect(handle_operator_stub.callCount).to.equal(0);
        expect(handle_constant_stub.callCount).to.equal(0);
    });

    it(`getOperand works with constants.`, function() {
        let props = getProps();
        let calc_obj = {
            value: "1",
            type: CALC_TYPES.const
        };
        let calculator = shallow(<Calculator {...props} />);
        let operand = calculator.instance().getOperand(calc_obj);
        expect(operand).to.deep.equal(calc_obj);
    });

    it(`getOperand works with simple variables.`, function() {
        let props = getProps();
        let calc_obj = {
            value: "clt",
            type: CALC_TYPES.var
        };

        let expected = {
            type: CALC_TYPES.var,
            path: props.variables.clt.path,
            name: props.variables.clt.cdms_var_name
        };

        let calculator = shallow(<Calculator {...props} />);
        let operand = calculator.instance().getOperand(calc_obj);
        expect(operand).to.deep.equal(expected);

        props.variables.clt.json = "some_json"; // set the prop that getOperand will use
        expected = {
            type: CALC_TYPES.var,
            json: "some_json"
        };
        operand = calculator.instance().getOperand(calc_obj);
        expect(operand).to.deep.equal(expected);
    });

    test_cases = [
        { left: undefined, operator: undefined, right: undefined, expected: "0." },
        { left: { value: "0", type: CALC_TYPES.const }, operator: undefined, right: undefined, expected: "0." },
        { left: { value: "1", type: CALC_TYPES.const }, operator: undefined, right: undefined, expected: "1." },
        { left: { value: "12", type: CALC_TYPES.const }, operator: undefined, right: undefined, expected: "12." },
        { left: { value: "12.", type: CALC_TYPES.const }, operator: undefined, right: undefined, expected: "12." },
        { left: { value: "12.0", type: CALC_TYPES.const }, operator: undefined, right: undefined, expected: "12.0" },
        { left: { value: "clt", type: CALC_TYPES.var }, operator: undefined, right: undefined, expected: "clt" },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: undefined, expected: "1 + 0." },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "0.", type: CALC_TYPES.const }, expected: "1 + 0." },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "0.1", type: CALC_TYPES.const }, expected: "1 + 0.1" },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "2", type: CALC_TYPES.const }, expected: "1 + 2." },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "2.", type: CALC_TYPES.const }, expected: "1 + 2." },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "2.2", type: CALC_TYPES.const }, expected: "1 + 2.2" },
        { left: { value: "1", type: CALC_TYPES.const }, operator: "+", right: { value: "clt", type: CALC_TYPES.var }, expected: "1 + clt" }
    ];
    test_cases.forEach(function(test_case, index) {
        it(`handleDecimal works. Case: ${index}`, function() {
            let props = getProps();
            let calculator = shallow(<Calculator {...props} />);
            calculator.setState({
                calculation_left_side: test_case.left,
                calculation_operator: test_case.operator,
                calculation_right_side: test_case.right
            });
            calculator.instance().handleDecimal();
            expect(calculator.instance().printCalculation()).to.equal(test_case.expected);
        });
    });
});
