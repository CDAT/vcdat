/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'
import AddEditRemoveNav from '../../../src/js/components/AddEditRemoveNav/AddEditRemoveNav.jsx'

describe('AddEditRemoveNavTest.jsx', function() {
    it('renders without exploding', function() {
        const add_edit_remove_nav = shallow(<AddEditRemoveNav/>)
        expect(add_edit_remove_nav).to.have.lengthOf(1);
    });
});
