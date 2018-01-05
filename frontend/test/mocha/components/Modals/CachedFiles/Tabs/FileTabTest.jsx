/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import FileTab from '../../../../../../src/js/components/modals/CachedFiles/Tabs/FileTab.jsx'
import { shallow } from 'enzyme'
import sinon from 'sinon'

const props = {
    onTryClose: sinon.spy(),
    cachedFiles: {},
    curVariables: {},
    loadVariables: sinon.spy(),
    addFileToCache: sinon.spy(),
    switchTab: sinon.spy(),
    selectedTab: "file"
}

describe('FileTabTest.jsx', function() {
    it('Renders without exploding', () => {        
        const cached_files = shallow(<FileTab {...props}/>)
        expect(cached_files).to.have.lengthOf(1);
    });

    it('Getting selectedFilePath returns clean paths', () => {
        const cached_files = shallow(<FileTab {...props}/>)
        expect(cached_files).to.have.lengthOf(1);
        cached_files.setState({selectedFile: {path: "/example/path/to/test/", name: "filename.txt"}}) // good path
        expect(cached_files.instance().selectedFilePath).to.equal("/example/path/to/test/filename.txt")

        cached_files.setState({selectedFile: {path: "example/path/to/test/", name: "filename.txt"}}) // no leading slash
        expect(cached_files.instance().selectedFilePath).to.equal("/example/path/to/test/filename.txt")

        cached_files.setState({selectedFile: {path: "/example/path/to/test", name: "filename.txt"}}) // no trailing slash
        expect(cached_files.instance().selectedFilePath).to.equal("/example/path/to/test/filename.txt")

        cached_files.setState({selectedFile: {path: "example/path/to/test", name: "filename.txt"}}) // no leading or trailing slash
        expect(cached_files.instance().selectedFilePath).to.equal("/example/path/to/test/filename.txt")

        cached_files.setState({selectedFile: {path: "", name: "filename.txt"}}) // filename only
        expect(cached_files.instance().selectedFilePath).to.equal("/filename.txt")

        cached_files.setState({selectedFile: undefined}) // no path
        expect(cached_files.instance().selectedFilePath).to.equal('')
    });

    it('VariableName getter works', () => {
        const cached_files = shallow(<FileTab {...props}/>)
        cached_files.setState({
            variablesAxes: [
                {dummyName: {
                    axisList: ["latitude", "longitude"],
                    shape: [1,2,80,97],
                    bounds: null,
                    lonLat: null,
                    gridType: "rectilinear",
                    name: "A dummy variable for testing",
                    units: "m/s",
                }},
                {second: {
                    shape: [1,2,80,97],
                    name: "A second dummy variable for testing",
                    units: "m/s",
                    data: [200, 800]
                }}
            ],
            selectedVariableName: "dummyName",
            redefinedVariableName: "redefinedName",
        })
        expect(cached_files.instance().variableName).to.equal("redefinedName")

        cached_files.setState({
            variablesAxes: [
                {dummyName: {
                    axisList: ["latitude", "longitude"],
                    shape: [1,2,80,97],
                    bounds: null,
                    lonLat: null,
                    gridType: "rectilinear",
                    name: "A dummy variable for testing",
                    units: "m/s",  
                }},
                {second: {
                    shape: [1,2,80,97],
                    name: "A second dummy variable for testing",
                    units: "m/s",
                    data: [200, 800]
                }}
            ],
            selectedVariableName: "dummyName",
            redefinedVariableName: undefined,
        })
        expect(cached_files.instance().variableName).to.equal("dummyName")

        cached_files.setState({
            variablesAxes: [
                {dummyName: {
                    axisList: ["latitude", "longitude"],
                    shape: [1,2,80,97],
                    bounds: null,
                    lonLat: null,
                    gridType: "rectilinear",
                    name: "A dummy variable for testing",
                    units: "m/s"
                }},
                {second: {
                    shape: [1,2,80,97],
                    name: "A second dummy variable for testing",
                    units: "m/s",
                    data: [200, 800]
                }}
            ],
            selectedVariableName: undefined,
            redefinedVariableName: undefined,
        })
        expect(cached_files.instance().variableName).to.equal("")
    });

    it('LoadVariable and ComponentDidUpdate works', () => {
        let spy = sinon.spy()
        const cached_files = shallow(<FileTab {...props} loadVariables={spy}/>)

        cached_files.setState({
            variablesAxes: [
                {dummyName: {
                    axisList: ["latitude", "longitude"],
                    shape: [1,2,80,97],
                    bounds: null,
                    lonLat: null,
                    gridType: "rectilinear",
                    name: "A dummy variable for testing",
                    units: "m/s",  
                }},
                {second: {
                    shape: [1,2,80,97],
                    name: "A second dummy variable for testing",
                    units: "m/s",
                    data: [200, 800]
                }}
            ],
            selectedVariableName: "dummyName", // if this name is not present in variableAxes, an infinite loop occurs
            selectedFile: {"path": "/fake/path", "name": "dummyFileName"},
            selectedVariable: {
                axisList: ["latitude"],
                bounds: null,
                gridType: "rectilinear",
                lonLat: null,
                name: "dummyVar",
                shape: [120, 46, 72],
                units: "m/s"
            },
            dimension: [
                {axisName: "latitude"},
            ]
        })
        cached_files.instance().loadVariable()
        sinon.assert.calledOnce(spy)
        expect(cached_files.state().redefinedVariableName).to.equal("")
    })

    it('Starting and ending a drag sets state', () => {        
        const cached_files = shallow(<FileTab {...props}/>)
        let event = {
            dataTransfer:{
                setData: function(){return}
            }
        }
        expect(cached_files.state().showBookmarkZone).to.be.false
        cached_files.instance().handleDragStart(event, {})
        expect(cached_files.state().showBookmarkZone).to.be.true
        cached_files.instance().handleDragEnd()
        expect(cached_files.state().showBookmarkZone).to.be.false
    });

    it('Drop sets state', () => {
        const set_item_spy = sinon.spy()
        global.window.localStorage = { setItem: set_item_spy } // localStoarge doesnt exist during testing, so mock it 
        const cached_files = shallow(<FileTab {...props}/>)
        let test_bookmark = {
            directory: false,
            modifiedTime: "Thu, 04 Jan 2018 19:00:00 GMT",
            name: "clt.nc",
            path: "/Users/user/sample_data//",
            subItems: {}
        }
        let event = {
            dataTransfer:{
                getData: function(){
                    return JSON.stringify(test_bookmark)
                }
            }
        }
        cached_files.instance().handleDrop(event)
        let bookmarks = cached_files.state().bookmarkFiles
        let new_bookmark = bookmarks[bookmarks.length-1]
        sinon.assert.calledOnce(set_item_spy)
        expect(new_bookmark.modifiedTime).to.equal(test_bookmark.modifiedTime)
        expect(new_bookmark.name).to.equal(test_bookmark.name) 
        expect(new_bookmark.path).to.equal(test_bookmark.path)
    });

    it('Drop error is caught, and state isnt set', () => {
        let log = console.log // eslint-disable-line no-console
        console.log = function(){return} // eslint-disable-line no-console
        const set_item_spy = sinon.stub().throws()
        global.window.localStorage = { setItem: set_item_spy } // localStorage doesnt exist during testing, so mock it 
        const cached_files = shallow(<FileTab {...props}/>)
        let test_bookmark = {
            directory: false,
            modifiedTime: "Thu, 04 Jan 2018 19:00:01 GMT",
            name: "clt.nc",
            path: "/Users/user/sample_data//",
            subItems: {}
        }
        let event = {
            dataTransfer:{
                getData: function(){
                    return JSON.stringify(test_bookmark)
                }
            }
        }
        cached_files.instance().handleDrop(event)
        sinon.assert.calledOnce(set_item_spy)
        expect(cached_files.state().bookmarkFiles.length).to.equal(0)
        console.log = log // eslint-disable-line no-console
    });

    it('Handles file selection', () => {
        global.vcs = {
            variables: () => { 
                return Promise.resolve([
                    { clt: {
                        gridType: "rectilinear",
                        name: "Total cloudiness",
                        axisList: ["time", "latitude", "longitude"],
                        bounds: null,
                        shape: [0, 1, 2],
                        units: "%",
                    }},
                    { second: {
                        shape: [1,2,80,97],
                        name: "A second dummy variable for testing",
                        units: "m/s",
                        data: [200, 800]
                    }}
                ])
            }
        }
        const cached_files = shallow(<FileTab {...props}/>)
        let file = {
            name: "dummyFile",
            path: "/some/dummy/path/"
        }
        const set_item_spy = sinon.stub()
        global.window.localStorage = { setItem: set_item_spy } // localStorage doesnt exist during testing, so mock it 
        cached_files.setState({ showFileExplorer: true, selectedVariableName: "" })
        expect(cached_files.state().historyFiles.length).to.equal(0)
        // handleFileSelected is asynchronous, we return the promise to mocha and it will handle it properly
        return cached_files.instance().handleFileSelected(file).then(() => {
            expect(cached_files.state().showFileExplorer).to.be.false
            expect(cached_files.state().selectedVariableName).to.equal("clt")
            expect(cached_files.state().selectedVariable.name).to.equal("Total cloudiness")
        })
    });
});