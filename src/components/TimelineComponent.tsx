import React, { Component } from "react";
import { Timeline } from "antd";

export class TimelineComponent extends Component {

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <Timeline mode="alternate">
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
                    <Timeline.Item >Sed ut totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</Timeline.Item>
                    <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
                    <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item >Sed ut totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</Timeline.Item>
                </Timeline>
            </div>
        )
    }
}