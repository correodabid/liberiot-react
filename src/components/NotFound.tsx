import React from "react";
import { Col, Button } from 'antd';
import error from '../assets/error.svg'
import { TitlePageComponent } from "./TitlePage";


export const NotFoundComponent = () => (
    <div style={{ padding: '2em' }}>
        <TitlePageComponent title="Not found" description="Page not found" />
        <div style={{ marginTop: '8em' }}>
            <Col span={8} offset={6} >
                <img width={'70%'} src={error} alt="error" />
            </Col>
            <Col span={10} style={{ fontFamily: 'Helvetica', color: 'gray' }}>
                <span style={{ fontSize: '7em', fontWeight: 600, color: 'black' }}> 404</span>
                <p style={{ fontWeight: 100, fontSize: '1.5em' }}> Ooops! Seems this page doesn't exist. </p>
                <p style={{ fontWeight: 100, fontSize: '1.1em' }}> Try to change the route</p>
                <a href='/'> <Button>Go back to dashboard</Button> </a>
            </Col>
        </div>
    </div>
)
