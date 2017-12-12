/* globals it, describe, before, beforeEach, */
var chai = require('chai');
var expect = chai.expect;
var React = require('react');

import ImportExportModal from '../../../../../src/js/components/modals/ColormapEditor/ImportExportModal.jsx'
import { shallow } from 'enzyme'


const import_export_modal = shallow(<ImportExportModal/>)

describe('ImportExportModalTest.jsx', function() {
    it('renders without exploding', () => {
        expect(import_export_modal).to.have.lengthOf(1);
    });
});