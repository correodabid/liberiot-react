import React from "react";
import { Col, Button } from 'antd';
import server from '../assets/server.svg'


export const ServerErrorComponent = () => (
    <div style={{ padding: '2em' }}>
        <div style={{ marginTop: '8em' }}>
            <Col span={8} offset={6} >
                <img width={'70%'} src={server} alt="error" />
            </Col>
            <Col span={10} style={{ fontFamily: 'Helvetica', color: 'gray' }}>
                <span style={{ fontSize: '7em', fontWeight: 600, color: 'black' }}> 505</span>
                <p style={{ fontWeight: 100, fontSize: '1.5em' }}> Ooops! Seems the server isn't responding </p>
                <a href='/'> <Button>Go back to dashboard</Button> </a>
            </Col>
        </div>
    </div>
)
