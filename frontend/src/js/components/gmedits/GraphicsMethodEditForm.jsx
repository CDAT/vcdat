import React from 'react'
import BoxfillType from './BoxfillType.jsx'

var GraphicsMethodEditForm = React.createClass({
    propTypes: {
        graphicsMethod: React.PropTypes.string,
        graphicsMethodParent: React.PropTypes.string,
        gmProps: React.PropTypes.object
    },
    // might not need fillTable()
    fillTable() {
        let table_contents = []
        if(this.props.graphicsMethodParent === 'boxfill') {
            // put the boxfill type stuff here
            table_contents.push(
                <BoxfillType defaultType={this.props.json['boxfill_type']}/>
            )
        }
        return table_contents;
    },
    render() {
        let json = this.props.gmProps;
        let gm = this.props.graphicsMethod;
        let gmp_shortname;
        switch (this.props.graphicsMethodParent) {
            case "boxfill":
                gmp_shortname = "Gfb"
                break;
            default:
                break;
        }
        let boxfill_type;
        if(json['Gfb']) {
            boxfill_type = <BoxfillType defaultType={json[gmp_shortname][gm]['boxfill_type']}/>
        }
        return(
            <table>
                {boxfill_type}

            </table>
        )
    }
});

export default GraphicsMethodEditForm;
