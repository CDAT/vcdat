/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ColormapEditor from '../../../../../src/js/components/modals/ColormapEditor/ColormapEditor.jsx'
import { shallow } from 'enzyme'

const colormap_editor = shallow(<ColormapEditor/>)

describe('ColormapEditorTest.jsx', function() {
    it('renders without exploding', () => {
        expect(colormap_editor).to.have.lengthOf(1);
    });
});