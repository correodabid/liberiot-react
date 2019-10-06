import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Empty, Switch, Spin } from 'antd';
import { Chart, Axis, Legend, Tooltip, Polygon } from 'viser-react';
import { ISeriesConfig } from 'viser';

import { TransmissionStore } from "../../stores";

interface IProps {
    deviceId: string;
    TransmissionStore?: TransmissionStore;
}

@inject('TransmissionStore')
@observer
export class Last24HoursTransmissions extends Component<IProps> {
    async componentDidMount() {
        this.getLastTransmission()
    }

    getLastTransmission = async () => {
        await this.props.TransmissionStore!.getLastWeekTransmissions(this.props.deviceId)
    }

    handleTypeChange = async (checked: boolean) => {
        const type = checked ? 'rssi' : 'snr';
        this.props.TransmissionStore!.changeType(type)
        await this.getLastTransmission();
    }

    render() {
        const { lastWeektransmissions, isLoading, heatMapType, scaleRange } = this.props.TransmissionStore!;

        const hours: string[] = []
        for (let i: number = 0; i <= 23; i++) {
            let value = i.toString();
            value.length === 1 ? hours.push('0' + value) : hours.push(value)
        }

        const chartScale = [{
            dataKey: 'hour',
            type: 'cat',
            values: hours
        },
        {
            dataKey: 'day',
            type: 'cat',
        },
        {
            dataKey: 'total',
            min: scaleRange.min,
            max: scaleRange.max
        }];

        const seriesOpts: ISeriesConfig = {
            color: ['total', 'red-yellow-green'],
            position: 'hour*day*date',
            style: {
                lineWidth: 1,
                stroke: '#fff'
            }
        };

        return (
            <Card>
                <div style={{ fontSize: '1.3em' }}>
                    <span style={{ marginRight: '.5em' }}>
                        Last week transmissions
                    </span>
                    <Switch checkedChildren="Rssi" unCheckedChildren="Snr" checked={heatMapType === 'rssi' ? true : false}
                        loading={isLoading} onChange={this.handleTypeChange} />
                </div>
                {
                    lastWeektransmissions.length > 0 ?
                        <Spin spinning={isLoading}>
                            <Chart forceFit height={400} data={lastWeektransmissions} scale={chartScale} renderer={'svg'}>
                                <Legend offset={40} itemFormatter={(val) => parseInt(val.toFixed(0))} />
                                <Tooltip showTitle={true} title='date' />
                                <Axis />
                                <Polygon {...seriesOpts} />
                            </Chart>
                        </Spin>
                        : <Empty />
                }
            </Card>
        );
    }
}
