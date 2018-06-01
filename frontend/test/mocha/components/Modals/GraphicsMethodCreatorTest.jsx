/* globals it, describe, before, beforeEach, */
let chai = require("chai");
let expect = chai.expect;
let React = require("react");

import { PureGraphicsMethodCreator as GraphicsMethodCreator } from "../../../../src/js/components/modals/GraphicsMethodCreator.jsx";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
Enzyme.configure({ adapter: new Adapter() });
import { shallow } from "enzyme";
import sinon from "sinon";

const getProps = function() {
    return {
        show: true,
        close: sinon.spy(),
        graphics_methods: {
            boxfill: {
                default: { name: "default" },
                polar: { name: "polar" },
                quick: { name: "quick" }
            },
            isofill: {
                default: { name: "default" },
                polar: { name: "polar" },
                quick: { name: "quick" }
            }
        },
        createGraphicsMethod: sinon.spy(),
        selectGraphicsMethod: sinon.spy()
    };
};

describe("GraphicsMethodCreatorTest.jsx", function() {
    it("renders without exploding", () => {
        let props = getProps();
        let gm_creator = shallow(<GraphicsMethodCreator {...props} />);
        expect(gm_creator).to.have.lengthOf(1);
    });

    it("Sets default gm type and method when default is present", () => {
        let props = getProps();
        let gm_creator = shallow(<GraphicsMethodCreator {...props} />);
        expect(gm_creator.state().selected_gm_type).to.equal("boxfill");
        expect(gm_creator.state().selected_gm_method).to.equal("default");
    });

    it("Sets default gm type and method when default is not present", () => {
        let props = getProps();
        props.graphics_methods = {
            boxfill: {
                polar: { name: "polar" },
                quick: { name: "quick" }
            },
            isofill: {
                polar: { name: "polar" },
                quick: { name: "quick" }
            }
        };
        let gm_creator = shallow(<GraphicsMethodCreator {...props} />);
        expect(gm_creator.state().selected_gm_type).to.equal("boxfill");
        expect(gm_creator.state().selected_gm_method).to.equal("polar");
    });

    it("getValidationState works", () => {
        let props = getProps();
        let gm_creator = shallow(<GraphicsMethodCreator {...props} />);

        expect(gm_creator.instance().getValidationState("", "")).to.deep.equal({ status: null, message: "" }); // returns null if no name length
        expect(gm_creator.instance().getValidationState("default", "boxfill")).to.deep.equal({
            status: "error",
            message: "A Graphics Method with that name already exists"
        });
        expect(gm_creator.instance().getValidationState("polar", "boxfill")).to.deep.equal({
            status: "error",
            message: "A Graphics Method with that name already exists"
        });
        expect(gm_creator.instance().getValidationState("quick", "boxfill")).to.deep.equal({
            status: "error",
            message: "A Graphics Method with that name already exists"
        });
        expect(gm_creator.instance().getValidationState("default", "isofill")).to.deep.equal({
            status: "error",
            message: "A Graphics Method with that name already exists"
        });
        expect(gm_creator.instance().getValidationState("polar", "isofill")).to.deep.equal({
            status: "error",
            message: "A Graphics Method with that name already exists"
        });
        expect(gm_creator.instance().getValidationState("quick", "isofill")).to.deep.equal({
            status: "error",
            message: "A Graphics Method with that name already exists"
        });
        expect(gm_creator.instance().getValidationState("__temp", "boxfill")).to.deep.equal({
            status: "error",
            message: "Graphics Method names should not start with two underscores"
        });
        expect(gm_creator.instance().getValidationState("test", "boxfill")).to.deep.equal({ status: "success", message: "" });
        expect(gm_creator.instance().getValidationState("valid", "boxfill")).to.deep.equal({ status: "success", message: "" });
    });

    it("handleChange function sets state", () => {
        let props = getProps();
        let gm_creator = shallow(<GraphicsMethodCreator {...props} />);
        const event_with_null_validation = {
            target: {
                value: ""
            }
        };
        const event_with_error_validation = {
            target: {
                value: "default"
            }
        };
        const event_with_success_validation = {
            target: {
                value: "valid"
            }
        };
        gm_creator.setState({ selected_gm_type: "boxfill" });
        gm_creator.instance().handleChange(event_with_null_validation);
        expect(gm_creator.state().new_gm_name).to.equal("");
        expect(gm_creator.state().validation_state).to.equal(null);

        gm_creator.instance().handleChange(event_with_error_validation);
        expect(gm_creator.state().new_gm_name).to.equal("default");
        expect(gm_creator.state().validation_state).to.equal("error");

        gm_creator.instance().handleChange(event_with_success_validation);
        expect(gm_creator.state().new_gm_name).to.equal("valid");
        expect(gm_creator.state().validation_state).to.equal("success");
    });

    it("createGraphicsMethod works", () => {
        global.vcs = {
            creategraphicsmethod: sinon.stub().resolves()
        };
        const state = {
            selected_gm_type: "boxfill",
            new_gm_name: "test_name",
            selected_gm_method: "default"
        };
        let props = getProps();
        props.createGraphicsMethod = sinon.spy();
        let gm_creator = shallow(<GraphicsMethodCreator {...props} />);
        gm_creator.setState(state);
        return gm_creator
            .instance()
            .createGraphicsMethod()
            .then(() => {
                expect(vcs.creategraphicsmethod.callCount).to.equal(1);
                expect(vcs.creategraphicsmethod.getCall(0).args[0]).to.equal(state.selected_gm_type);
                expect(vcs.creategraphicsmethod.getCall(0).args[1]).to.equal(state.new_gm_name);
                expect(vcs.creategraphicsmethod.getCall(0).args[2]).to.equal(state.selected_gm_method);
                expect(props.close.callCount).to.equal(1);
            });
    });

    it("handleKeyPress only causes a save when valid", () => {
        let props = getProps()
        let gm_creator = shallow(<GraphicsMethodCreator {...props} />)
        let stub = sinon.stub(gm_creator.instance(), "createGraphicsMethod").callsFake(() => {});
        gm_creator.setState({ validation_state: "error" });
        gm_creator.instance().handleKeyPress({ charCode: 100 });
        expect(stub.callCount).to.equal(0); // should not be called with keys besides enter
        gm_creator.instance().handleKeyPress({ charCode: 13 }); // 13 is the 'enter' key
        expect(stub.callCount).to.equal(0); // should not be called with inwvalid name

        gm_creator.setState({ validation_state: "success" });
        gm_creator.instance().handleKeyPress({ charCode: 100 });
        expect(stub.callCount).to.equal(0); // should not be called with keys besides enter
        gm_creator.instance().handleKeyPress({ charCode: 13 });
        expect(stub.callCount).to.equal(1); // should be called now that validation is 'success'
    });
});
