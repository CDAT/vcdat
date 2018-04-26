import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Panel, PanelGroup } from 'react-bootstrap'

import "./FileInfoModal.scss"

const status = {
    LOADING: "loading",
    SUCCESS: "success",
    FAILURE: "failure"
}

class FileInfoModal extends Component{
    constructor(props){
        super(props)
        this.state={
            load_status: status.LOADING,
            info: undefined,
        }
        this.getFileInfo = this.getFileInfo.bind(this)
    }

    componentDidMount(){
        this.getFileInfo(this.props.file)
    }

    getLoadingContent(){
        return <div className="loading-spinner"></div>
    }

    getFailureContent(){
        return <div id="file-info-failed">Failed to retrieve file info</div>
    }

    getSuccessContent(){
        return (
            <PanelGroup id="info-panels" defaultActiveKey="1">
                {
                    Object.keys(this.state.info).map((name, index) => {
                        return (
                            <Panel eventKey={index} key={index}>
                                <Panel.Heading>
                                    <Panel.Title toggle>{name}</Panel.Title>
                                </Panel.Heading>
                                <Panel.Body collapsible><div style={{whiteSpace: "pre-wrap"}}>{this.state.info[name]}</div></Panel.Body>
                            </Panel>
                        )
                    })
                }
            </PanelGroup>
        )
    }

    getFileInfo(file){
        return vcs.getvarinfofromfile(file).then( // make sure to return the promise so that this function can be tested by mocha
            (data) => { // on success
                this.setState({info: data, load_status: status.SUCCESS})
            },
            (error) => { // on failure
                console.error(error)
                this.setState({load_status: status.FAILURE})
            }
        )
    }

    render(){
        return(
            <Modal show={this.props.show} onHide={this.props.onTryClose}>
                <Modal.Header closeButton>
                    <Modal.Title bsClass="modal-title word-break-fix">File Info for {this.props.file}</Modal.Title>
                </Modal.Header>
                <Modal.Body bsClass="modal-body limit-height">
                    <div className="file-info-container">
                        {
                            this.state.load_status === status.LOADING ? this.getLoadingContent() :
                            this.state.load_status === status.FAILURE ? this.getFailureContent() :
                            this.state.load_status === status.SUCCESS ? this.getSuccessContent() :
                            /* istanbul ignore next */
                            () => {
                                console.error("Invalid load status", this.state.load_status)
                                return null
                            }
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="infotab-close" bsStyle="default" bsSize="small" onClick={() => this.props.onTryClose()}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

FileInfoModal.propTypes = {
    show: PropTypes.bool,
    onTryClose: PropTypes.func,
    file: PropTypes.string,
}
export { status }
export default FileInfoModal