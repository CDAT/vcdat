import React from 'react'

var BoxfillType = React.createClass({
    propTypes: {
        handleChange: React.PropTypes.func,
        type: React.PropTypes.string,
        headerClass: React.PropTypes.string,
        radioClass: React.PropTypes.string
    },
    render(){
        return (
            <div className='row'>
                <div className={this.props.headerClass}>
                    <h5>
                        Boxfill type:
                    </h5>
                </div>
                <div className={this.props.radioClass}>

                    {
                        this.props.type === 'linear'
                            ?   <input type='radio'
                                    name='boxfill_type'
                                    value='linear'
                                    id="bf-linear"
                                    onChange={this.props.handleChange}
                                    defaultChecked/>
                            :  <input type='radio'
                                    name='boxfill_type'
                                    value='linear'
                                    id="bf-linear"
                                    onChange={this.props.handleChange}/>
                            } linear
                </div>
                <div className={this.props.radioClass}>

                    {
                        this.props.type === 'log10'
                            ?   <input type='radio'
                                    name='boxfill_type'
                                    value='log10'
                                    id="bf-log10"
                                    onChange={this.props.handleChange}
                                    defaultChecked/>
                            :  <input type='radio'
                                    name='boxfill_type'
                                    value='log10'
                                    id="bf-log10"
                                    onChange={this.props.handleChange}/>
                    }  log10
                </div>
                <div className={this.props.radioClass}>
                    {
                        this.props.type === 'custom'
                            ?   <input type='radio'
                                    name='boxfill_type'
                                    value='custom'
                                    id="bf-custom"
                                    onChange={this.props.handleChange}
                                    defaultChecked/>
                            :  <input type='radio'
                                    name='boxfill_type'
                                    value='custom'
                                    id="bf-custom"
                                    onChange={this.props.handleChange}/>
                    } custom
                </div>
            </div>
        );
    }
});

export default BoxfillType;
