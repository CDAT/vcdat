/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import FileExplorer from '../../../../../src/js/components/modals/FileExplorer/FileExplorer.jsx'
import { shallow } from 'enzyme'

describe('FileExplorerTest.jsx', function() {
    it('renders without exploding', () => {
        const file_explorer = shallow(<FileExplorer/>)
        expect(file_explorer).to.have.lengthOf(1);
    });
});