import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Empty, Spin, Modal } from 'antd';
import { Chart, Axis, Legend, Tooltip, Polygon } from 'viser-react';
import { ISeriesConfig } from 'viser';
import moment from "moment";

import { HeartbeatStore } from "../../stores";
import { LastWeek, IHeartbeatsParams } from '../../stores/heartbeatStore';

import './Heatmap.scss';

interface IProps {
    HeartbeatStore?: HeartbeatStore;
}

@inject('HeartbeatStore')
@observer
export class LastWeekHeartbeats extends Component<IProps> {

    async componentDidMount() {
        await this.props.HeartbeatStore!.getLastWeekHeartbeats()
    }

    showActivity = async (data: LastWeek) => {
        const params: IHeartbeatsParams = {
            start: data.date.toJSON(),
            end: data.date.endOf('hour').toJSON(),
            gateway: this.props.HeartbeatStore!.GatewayStore.selectedGateway!._id!
        }
        try {
            const activity = await this.props.HeartbeatStore!.getHeartbeats(params);
            Modal.info({
                title: 'Activity',
                className: 'activity-modal-hide-buttons',
                maskClosable: true,
                content: (
                    <div>
                        <p>{data.date.startOf('hour').format('lll')}</p>
                        <p>Total average: {data.total}%</p>
                        <div id="activity">
                            {
                                activity.map((value: number, index: number) => (
                                    <div key={index} id={index.toString()}>
                                        <span style={{ backgroundColor: value ? 'green' : 'red' }}></span>
                                        {
                                            [0, 30, 60, 90].includes(index) &&
                                            <span className='tick'></span>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <div className='activity-info'>
                            <div className='info-0'>0</div>
                            <div className='info-15'>15</div>
                            <div className='info-30'>30</div>
                            <div className='info-45'>45</div>
                        </div>
                    </div>
                )
            })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { isLoading, lastWeekHeartbeats } = this.props.HeartbeatStore!;

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
            min: 0,
            max: 100
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
            <div>
                <div style={{ fontSize: '1.3em' }}>
                    <span style={{ marginRight: '.5em' }}>
                        Last week heartbeats
                    </span>
                </div>
                {
                    lastWeekHeartbeats.length > 0 ?
                        <Spin spinning={isLoading}>
                            <Chart forceFit height={400} data={lastWeekHeartbeats} scale={chartScale} renderer={'svg'}
                                onPlotClick={async (ev: any) => ev.data && this.showActivity(ev.data._origin)}
                            >
                                <Legend offset={40} itemFormatter={(val) => parseInt(val.toFixed(0)) + '%'} />
                                <Tooltip
                                    htmlContent={(title, items) => {
                                        var item = items[0];
                                        return `
                                            <div class="g2-tooltip">
                                                <div class="g2-tooltip-title">${moment(title).format('lll')}</div>
                                                <div class="g2-tooltip-content">
                                                    <span class='g2-tooltip-badge' style="background-color:${item.color}"></span>
                                                    ${item.name}<span class="g2-tooltip-value"> ${item.value}%</span>
                                                </div>
                                                <div class="g2-tooltip-footer">Click for more information</div>
                                            </div>
                                            `;
                                    }}
                                    showTitle={true} title={`date`}
                                />
                                <Axis />
                                <Polygon {...seriesOpts} />
                            </Chart>
                        </Spin>
                        : <Empty />
                }
            </div>
        );
    }
}
