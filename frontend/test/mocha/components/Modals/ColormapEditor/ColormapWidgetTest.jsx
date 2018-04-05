/* globals it, describe, before, beforeEach, */
var chai = require('chai')
var expect = chai.expect;
var React = require('react')

import ColormapWidget from '../../../../../src/js/components/modals/ColormapEditor/ColormapWidget.jsx'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'


describe('ColormapWidgetTest.jsx', function() {
    function getProps() {
        return {
            current_colormap: [
                [100, 100, 100, 100], // 3 cells total
                [70, 70, 70, 100],
                [40, 40, 40, 100],
            ],
            color: {
                rgb: {
                    r: 0,
                    g: 0,
                    b: 0,
                }
            },
            selected_cells_start: -1,
            selected_cells_end: -1,
            handleCellClick: sinon.spy(),
        }
    }
    it('renders without exploding', () => {
        let props = getProps()
        const colormap_widget = shallow(<ColormapWidget {...props}/>)
        expect(colormap_widget).to.have.lengthOf(1);
    });
    
    it('renders the correct number of cells', () => {
        let props = getProps()
        const colormap_widget = shallow(<ColormapWidget {...props}/>)
        expect(colormap_widget.find('.cells')).to.have.lengthOf(3)
    });

    it('makes a cell active when clicked', () => {
        let props = getProps()
        const colormap_widget = shallow(<ColormapWidget {...props}/>)
        let click_event = {
            target: {
                innerText: "1"
            }
        }
        colormap_widget.find('.cells').at(1).simulate("click", click_event)
        expect(props.handleCellClick.calledOnceWith(1, 1)).to.be.true

        click_event.target.innerText = "2"
        colormap_widget.find('.cells').at(2).simulate("click", click_event)
        expect(props.handleCellClick.calledWith(2, 2)).to.be.true
    });

    it('makes multiple cells active when shift clicked', () => {
        let props = getProps()
        const colormap_widget = shallow(<ColormapWidget {...props}/>)
        let click_event = {
            target: {
                innerText: "2"
            },
            shiftKey: false,
        }
        colormap_widget.find('.cells').at(2).simulate("click", click_event)
        expect(props.handleCellClick.calledOnceWith(2, 2)).to.be.true

        colormap_widget.setProps({selected_cells_start: 2, selected_cells_end: 2})
        click_event.target.innerText = "0"
        click_event.shiftKey = true;
        colormap_widget.find('.cells').at(0).simulate("click", click_event)
        expect(props.handleCellClick.callCount).to.equal(2)
        expect(props.handleCellClick.calledWith(2, 0)).to.be.true
    })

    it('does not change active cells if cell text is NaN', () => {
        let props = getProps()
        const colormap_widget = shallow(<ColormapWidget {...props}/>)
        let click_event = {
            target: {
                innerText: "0"
            }
        }
        colormap_widget.find('.cells').at(0).simulate("click", click_event)
        expect(props.handleCellClick.calledWith(0, 0)).to.be.true

        click_event.target.innerText = "not_a_number"
        colormap_widget.find('.cells').at(2).simulate("click", click_event)
        expect(props.handleCellClick.callCount).to.equal(1)
    });
});

