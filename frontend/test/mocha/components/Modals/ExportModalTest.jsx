/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import ExportModal from '../../../../src/js/components/modals/ExportModal.jsx'
import Enzyme from 'enzyme' 
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })
import { shallow } from 'enzyme'

describe('ExportModalTest.jsx', function() {
    it('renders without exploding', () => {
        var export_modal = shallow(<ExportModal/>)
        expect(export_modal).to.have.lengthOf(1)
    });

    it('Switch tab sets correct state', () => {
        var export_modal = shallow(<ExportModal/>)
        expect(export_modal.state().selected_tab).to.equal(0)
        export_modal.instance().switchTab(1)
        expect(export_modal.state().selected_tab).to.equal(1)
    });
});