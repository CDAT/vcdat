/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import TemplateEditor from '../../../../src/js/components/modals/TemplateEditor.jsx'
import PubSub from 'pubsub-js'
import PubSubEvents from '../../../../src/js/constants/PubSubEvents.js'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import sinon from 'sinon'

const getProps = function(){
    return {
        show: true,
        close: sinon.spy(),
        template: "loading"
    }
}

describe('TemplateEditorTest.jsx', function() {
    it('Renders without exploding', () => {
        let props = getProps()
        let template_editor = shallow(<TemplateEditor {...props} />)
        expect(template_editor).to.have.lengthOf(1)
    });

    it('Renders a spinner when loading', () => {
        let props = getProps()
        let template_editor = shallow(<TemplateEditor {...props} />)
        let spinner = template_editor.find("span.loading-spinner")
        expect(spinner).to.have.lengthOf(1)
        expect(template_editor.state().workingTemplate).to.be.undefined
    });

    it('Renders a spinner when loading', () => {
        let props = getProps()
        let template_editor = shallow(<TemplateEditor {...props} />)
        template_editor.setProps({template: "error"})
        let div = template_editor.find("#template-load-error")
        expect(div).to.have.lengthOf(1)
        expect(template_editor.state().workingTemplate).to.be.undefined
    });

    it('saveTemplate works as intended', () => {
        let props = getProps()
        global.vcs = {
            settemplate: sinon.stub().resolves()
        }
        let template_editor = shallow(<TemplateEditor {...props} />)
        template_editor.setProps({template: {name: "example_name"}})
        return template_editor.instance().saveTemplate().then(() => {
            expect(global.vcs.settemplate.called).to.be.true
            expect(props.close.called).to.be.true
        })
    });

    it('saveTemplate works as intended', () => {
        let props = getProps()
        let template_editor = shallow(<TemplateEditor {...props} />)
        template_editor.setProps({template: {name: "example_name",  outer: {inner: "value"}}})
        expect(template_editor.state().workingTemplate).to.deep.equal({name: "example_name",  outer: {inner: "value"}});
        const attribute = "outer"
        const key = "inner"
        const value = "new_value"
        template_editor.instance().onUpdate(attribute, key, value)
        expect(template_editor.state().workingTemplate).to.deep.equal({name: "example_name",  outer: {inner: "new_value"}});
    });

});