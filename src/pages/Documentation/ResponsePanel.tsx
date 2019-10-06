import React from "react";
import { Row } from "antd";
import ReactJson from "react-json-view";


type IProps = {
    response: any
}

type IState = {
}

export default class ResponsePanel extends React.Component<IProps, IState>{

    render() {
        const { response } = this.props

        return (
            <div  >
                <h3 style={{ margin: '.5em' }}><b> Response</b></h3>
                <Row style={{ textAlign: 'center', overflowWrap: 'anywhere' }}>
                    <ReactJson src={response} collapsed={2} name={false}
                        displayDataTypes={false}
                        displayObjectSize={false}
                        style={{ marginLeft: '5vw', textAlign: 'left', fontSize: '1.2em' }}
                    />
                </Row>
            </div>
        )
    }
}
