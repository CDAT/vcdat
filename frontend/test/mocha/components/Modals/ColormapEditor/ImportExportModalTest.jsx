/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ImportExportModal from '../../../../../src/js/components/modals/ColormapEditor/ImportExportModal.jsx'
import { shallow } from 'enzyme'
import sinon from 'sinon'


var import_export_modal = shallow(<ImportExportModal/>)

describe('ImportExportModalTest.jsx', function() {
    it('renders without exploding', () => {
        expect(import_export_modal).to.have.lengthOf(1)
    });
    it('Handles importing a file', () => {
        let mockColormap = {
            "name": "mockColormap",
            "colormap":[[100,100,100,100]]
        }
        let fakeFile = new Blob([JSON.stringify(mockColormap)], { type: 'text/html' });
        fakeFile["lastModifiedDate"] = ""
        fakeFile["name"] = "mockColormapFile"
        let event = {
            target:{
                files:[fakeFile]
            }
        }
        let stub = sinon.stub(window.FileReader.prototype, 'readAsText').callsFake(function() {
            let event = {
                target: {
                    result: JSON.stringify(mockColormap)
                }
            }
            this.onload(event);
        });
        import_export_modal.instance().handleFileChange(event)
        expect(import_export_modal.state().importName).to.equal(mockColormap.name)
        for(let i = 0; i < mockColormap.colormap[0].length; i++){
            expect(import_export_modal.state().importColormap[0][i]).to.equal(mockColormap.colormap[0][i])
        }
    });
    it('Creates the correct json for download', () => {
        let result = {
            name: "mockName",
            colormap: [[75,75,75,75]]
        }
        let event = {
            target: {
                value: "mockName"
            }
        }
         
        import_export_modal = shallow(<ImportExportModal currentColormap={result.colormap} />)

        import_export_modal.instance().handleChange(event)
        expect(import_export_modal.state().name).to.equal(result.name)
        let data = import_export_modal.state().data.split("data:text/json;charset=utf-8,")[1]
        data = decodeURIComponent(data)
        expect(data).to.equal(JSON.stringify(result))
    });
});