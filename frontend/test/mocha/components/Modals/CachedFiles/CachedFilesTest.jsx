/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import CachedFiles from '../../../../../src/js/components/modals/CachedFiles/CachedFiles.jsx'
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
    selectedTab: tabs.file    
}

describe('CachedFilesTest.jsx', function() {
    it('renders without exploding', () => {       
        const cached_files = shallow(<CachedFiles {...props}/>)
        expect(cached_files).to.have.lengthOf(1);
    });

    it('switchTab sets state', () => {
        const cached_files = shallow(<CachedFiles {...props}/>)
        let tabs = ["file", "esgf", "opendap", "edit", "info"]
        tabs.map((tab) =>{
            cached_files.instance().switchTab(tab)
            expect(cached_files.state().selectedTab).to.equal(tab)
        })
    });

});