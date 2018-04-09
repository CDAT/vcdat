import React, { Component } from 'react'

class ExampleComponent extends Component {

    sayHello(){
        return "Hello"
    }

    render(){
        return (
            <div className="test">
                <span>TEST</span>
            </div>
        )
    }
}

export default ExampleComponent;
