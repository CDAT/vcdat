import React, { Component } from 'react'
import reactCSS from 'reactcss'

class CustomHuePointer extends Component {

    render(){
        const styles = reactCSS({
            'default': {
                huePointer:{
                    width: "25px",
                    height: "5px",
                    marginTop: "-3px",
                    borderRadius: "3px",
                    boxShadow: "rgba(0, 0, 0, 0.6) 0px 0px 2px",
                    background: "rgb(255, 255, 255)",
                }
            }
        });
        return(
            <div
                style={styles.huePointer}
            />
        )
    }
}

export default CustomHuePointer;