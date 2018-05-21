/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
import React from 'react'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import sinon from 'sinon'
import TemplateList from '../../../src/js/components/TemplateList.jsx'

const getProps = function(){
    return {
        templates: ["ASD", "default", "quick"],
        selected_template: "",
        selectTemplate: sinon.spy(),
        updateTemplate: sinon.spy(),
        removeTemplate: sinon.spy(),
    }
}

describe('TemplateListTest.jsx', function() {
    it('Renders without exploding', function() {
        let props = getProps()
        const template_list = shallow(<TemplateList {...props}/>)
        expect(template_list).to.have.lengthOf(1);
    });

    it('Edit does not change state if no template is selected', function() {
        global.vcs = {
            gettemplate: sinon.stub().resolves() // should not be called this test
        }
        let props = getProps()
        props.selected_template = ""
        const template_list = shallow(<TemplateList {...props}/>)
        template_list.instance().editTemplate()
        expect(global.vcs.gettemplate.callCount).to.equal(0)
        expect(template_list.state().showTemplateEditor).to.equal(false)
    });

    it('EditTemplate sets state ', function() {
        global.vcs = {
            gettemplate: sinon.stub().resolves("data")
        }
        let props = getProps()
        props.selected_template = "quick"
        const template_list = shallow(<TemplateList {...props}/>)
        return template_list.instance().editTemplate().then(() =>{ // editTemplate is async. Make sure to check results after it has run
            expect(global.vcs.gettemplate.callCount).to.equal(1)
            expect(global.vcs.gettemplate.getCall(0).args[0]).to.equal("quick") // check that first argument passed to vcs is selected_template
            expect(template_list.state().showTemplateEditor).to.equal(true)
            expect(template_list.state().template_data).to.equal("data")
        })
    });

    it('EditTemplate handles error', function() {
        let warn = console.warn
        console.warn = () => {}
        global.vcs = {
            gettemplate: sinon.stub().rejects()
        }
        let props = getProps()
        props.selected_template = "quick"
        const template_list = shallow(<TemplateList {...props}/>)
        return template_list.instance().editTemplate().then(() =>{ // editTemplate is async. Make sure to check results after it has run
            expect(global.vcs.gettemplate.callCount).to.equal(1)
            expect(global.vcs.gettemplate.getCall(0).args[0]).to.equal("quick") // check that first argument passed to vcs is selected_template
            expect(template_list.state().showTemplateEditor).to.equal(true)
            expect(template_list.state().template_data).to.equal("error")
            console.warn = warn
        })
    });

    it('RemoveTemplate works', function() {
        global.vcs = {
            removetemplate: sinon.stub().resolves()
        }
        let props = getProps()
        props.selected_template = "quick"
        const template_list = shallow(<TemplateList {...props}/>)
        return template_list.instance().removeTemplate().then(() =>{ // removeTemplate is async. Make sure to check results after it has run
            expect(global.vcs.removetemplate.callCount).to.equal(1)
            expect(global.vcs.removetemplate.getCall(0).args[0]).to.equal("quick") // Check that backend state update is called
            expect(props.removeTemplate.callCount).to.equal(1)
            expect(props.removeTemplate.getCall(0).args[0]).to.equal("quick") // Check that frontend state update is called
        })
    });
});