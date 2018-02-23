/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');
import { shallow } from 'enzyme'
import AddEditRemoveNav from '../../../src/js/components/AddEditRemoveNav/AddEditRemoveNav.jsx';

describe('AddEditRemoveNavTest.jsx', function() {
    it('renders without exploding', function() {
        const add_edit_remove_nav = shallow(<AddEditRemoveNav/>)
        expect(add_edit_remove_nav).to.have.lengthOf(1);
    });
});
