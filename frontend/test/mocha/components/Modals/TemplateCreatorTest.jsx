/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import TemplateCreator from '../../../../src/js/components/modals/TemplateCreator.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
import { createMockStore } from 'redux-test-utils'

const getProps = function(){
    return {
        show: true,
        close: sinon.spy(),
        templates: ["ASD", "default", "quick"],
        createTemplate: sinon.spy(),
        store: createMockStore({})
    }
}

describe('TemplateCreatorTest.jsx', function() {
    it('renders without exploding', () => {
        let props = getProps()
        var template_creator = shallow(<TemplateCreator {...props} />)
        expect(template_creator).to.have.lengthOf(1)
    });

    it('Sets default base template if no template named "default" exists', () => {
        let props = getProps()
        props.templates = ["ASD", "quick"]
        var template_creator = shallow(<TemplateCreator {...props} />).dive()
        expect(template_creator.state().selected_base_template).to.equal("ASD")
    });
    

    it('getValidationState works', () => {
        let props = getProps()
        var template_creator = shallow(<TemplateCreator {...props} />).dive()

        expect(template_creator.instance().getValidationState("")).to.equal(null) // returns null if no name length
        expect(template_creator.instance().getValidationState("ASD")).to.equal("error")
        expect(template_creator.instance().getValidationState("default")).to.equal("error")
        expect(template_creator.instance().getValidationState("quick")).to.equal("error")
        expect(template_creator.instance().getValidationState("test")).to.equal("success")
        expect(template_creator.instance().getValidationState("valid")).to.equal("success")
    });

    it('handleChange function works', () => {
        let props = getProps()
        var template_creator = shallow(<TemplateCreator {...props} />).dive()
        const event_with_null_validation = {
            target: {
                value: ""
            }
        }
        const event_with_error_validation = {
            target: {
                value: "ASD"
            }
        }
        const event_with_success_validation = {
            target: {
                value: "valid"
            }
        }

        template_creator.instance().handleChange(event_with_null_validation)
        expect(template_creator.state().new_template_name).to.equal("")
        expect(template_creator.state().validation_state).to.equal(null)

        template_creator.instance().handleChange(event_with_error_validation)
        expect(template_creator.state().new_template_name).to.equal("ASD")
        expect(template_creator.state().validation_state).to.equal("error")

        template_creator.instance().handleChange(event_with_success_validation)
        expect(template_creator.state().new_template_name).to.equal("valid")
        expect(template_creator.state().validation_state).to.equal("success")
    });

    it('createTemplate works', () => {
        global.vcs = {
            createtemplate: sinon.stub().resolves()
        }
        let props = {
            show: true,
            close: sinon.spy(),
            templates: ["ASD", "default", "quick"],
            createTemplate: sinon.spy(),
            store: createMockStore({})
        }
        var template_creator = shallow(<TemplateCreator {...props} />).dive()
        template_creator.setState({new_template_name: "test_name"})
        return template_creator.instance().createTemplate().then(() => {
            expect(vcs.createtemplate.callCount).to.equal(1)
            expect(vcs.createtemplate.getCall(0).args[0]).to.equal("test_name")
            expect(vcs.createtemplate.getCall(0).args[1]).to.equal("default")
            expect(props.close.callCount).to.equal(1)
        })
    });

    it('handleKeyPress only causes a save when valid', () => {
        let props = {
            show: true,
            close: sinon.spy(),
            templates: ["ASD", "default", "quick"],
            createTemplate: sinon.spy(),
            store: createMockStore({})
        }
        var template_creator = shallow(<TemplateCreator {...props} />).dive() // fuuuuuu
        let stub = sinon.stub(template_creator.instance(), 'createTemplate').callsFake(() => {})
        template_creator.instance().forceUpdate()
        template_creator.setState({validation_state: "error"})
        template_creator.instance().handleKeyPress({charCode: 13}) // 13 is the 'enter' key
        expect(stub.callCount).to.equal(0) // should not be called with invalid name
        template_creator.instance().handleKeyPress({charCode: 100})
        expect(stub.callCount).to.equal(0) // should not be called with keys besides enter

        template_creator.setState({validation_state: "success"})
        template_creator.instance().handleKeyPress({charCode: 100})
        expect(stub.callCount).to.equal(0) // should not be called with keys besides enter
        template_creator.instance().handleKeyPress({charCode: 13})
        expect(stub.callCount).to.equal(1) // should be called now that validation is 'success'
    });
});