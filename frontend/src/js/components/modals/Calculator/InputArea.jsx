import React from 'react'

class InputArea extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className="input-area">
                <div className="input-wrapper">
                    <input className="new-variable-name" type="text" placeholder="test"/>
                    <span className="equals"> = </span>
                    <input className="calculation" type="text" value="testing" disabled />
                </div>
            </div>
        )
    }
}

export default InputArea