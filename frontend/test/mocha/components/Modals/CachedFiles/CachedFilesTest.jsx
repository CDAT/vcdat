/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import CachedFiles from '../../../../../src/js/components/modals/CachedFiles/CachedFiles.jsx'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import sinon from 'sinon'


const tabs = {
    file: "file",
    esgf: "esgf",
    opendap: "opendap",
    edit: "edit",
}

const props = {
    show: true,
    onTryClose: sinon.spy(),
    selectedTab: tabs.file,
    switchTab: sinon.spy(),
}

describe('CachedFilesTest.jsx', function() {
    it('renders without exploding', () => {       
        const cached_files = shallow(<CachedFiles {...props}/>)
        expect(cached_files).to.have.lengthOf(1);
    });
});