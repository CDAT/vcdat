/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import FileExplorer from '../../../../../src/js/components/modals/FileExplorer/FileExplorer.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import sinon from 'sinon'

describe('FileExplorerTest.jsx', function() {
    it('renders without exploding', () => {
        sinon.stub(FileExplorer.prototype, 'goHome').returns(true);
        const file_explorer = shallow(<FileExplorer/>)
        expect(file_explorer).to.have.lengthOf(1);
    });
});