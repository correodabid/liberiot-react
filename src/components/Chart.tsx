import React, { PureComponent } from 'react';
import { LineChart, Line } from 'recharts';

const data = [
    {
        name: 'Page A', pv: 2400,
    },
    {
        name: 'Page B', pv: 1398,
    },
    {
        name: 'Page C', pv: 9800,
    },
    {
        name: 'Page D', pv: 3908,
    },
    {
        name: 'Page E', pv: 4800,
    },
    {
        name: 'Page F', pv: 3800,
    },
    {
        name: 'Page G', pv: 4300,
    },
];

export class Chart extends PureComponent {
    render() {
        return (
            <LineChart width={300} height={100} data={data}>
                <Line dot={false} type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
        );
    }
}
