/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import FileInfoModal, { status } from '../../../../src/js/components/modals/FileInfoModal/FileInfoModal.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import sinon from 'sinon'
const shallow = Enzyme.shallow

describe('FileInfoModalTest.jsx', function() {
    beforeEach(function() {
        global.vcs = {
            getvarinfofromfile: sinon.stub().resolves({clt: "dummy info", u: "also dummy info"})
        }
    })

    it('renders without exploding', () => {
        const mockClose = sinon.spy()
        const file_info = shallow(<FileInfoModal show={true} onTryClose={mockClose} file=''/>)
        expect(file_info).to.have.lengthOf(1)
    })

    it('getLoadingContent works', () => {
        const mockClose = sinon.spy()
        const file_info = shallow(<FileInfoModal show={true} onTryClose={mockClose} file=''/>)
        expect(file_info).to.have.lengthOf(1)
        expect(file_info.state().load_status).to.equal(status.LOADING)
        expect(file_info.find("div.loading-spinner")).to.have.lengthOf(1)
        
    })

    it('getFailureContent works', () => {
        const mockClose = sinon.spy()
        global.vcs = {
            getvarinfofromfile: sinon.stub().rejects(true)
        }
        const consoleError = console.error // Testing an error will normally log to console.
        console.error = (value) => {       // Prevent that unless something actually goes wrong
            if(value !== true){
                throw value
            }
        }
        const file_info = shallow(<FileInfoModal show={true} onTryClose={mockClose} file=''/>)
        expect(file_info.state().load_status).to.equal(status.LOADING)
        file_info.instance().getFileInfo("some_file").then(
            () => { // on resolve
                expect(file_info.state().load_status).to.equal(status.FAILURE)
                file_info.update() // Force a render before checking dom
                expect(file_info.find("#file-info-failed")).to.have.lengthOf(1)
                console.error = consoleError // put console.error back where it belongs
            },
            () => { // on reject
                console.error = consoleError // put console.error back where it belongs
                throw "When getFileInfo is called, the rejection should be handled and resolve. (Thrown from 'getFailureContent works' block)"
            }
        )
    })

    it('getSuccessContent works', () => {
        const mockClose = sinon.spy()
        const file_info = shallow(<FileInfoModal show={true} onTryClose={mockClose} file=''/>)
        return file_info.instance().getFileInfo("some_file").then(
            () => { // on resolve
                expect(file_info.state().load_status).to.equal(status.SUCCESS)
                file_info.update() // Force a render before checking dom
                expect(file_info.find("#info-panels")).to.have.lengthOf(1)
            },
            () => { // on reject
                throw "Promise should have resolved. (Thrown from 'getSuccessContent works' block)"
            }
        )
    })

    it('Close button works', () => {
        const mockClose = sinon.spy()
        const file_info = shallow(<FileInfoModal show={true} onTryClose={mockClose} file=''/>)
        expect(file_info).to.have.lengthOf(1)
        expect(mockClose.callCount).to.equal(0)
        file_info.find("#infotab-close").simulate("click")
        expect(mockClose.callCount).to.equal(1)
    })
})