import React from "react";
import axios from 'axios'
import { Collapse, Tag, Button, DatePicker, Col, Row, message } from "antd";
import { inject, observer } from "mobx-react";
import ReactJson from "react-json-view";
import moment, { Moment } from "moment";

import CollapseTableParams from "./CollapseTableParams";
import ResponsePanel from "./ResponsePanel";

import { ProjectStore, KeyStore, DeviceStore } from "../../stores";

import { exampleTransmission } from "../../utils/constants";

type IProps = {
    DeviceStore?: DeviceStore
    KeyStore?: KeyStore
    ProjectStore?: ProjectStore
}

type IState = {
    response: Array<any>;
    startDate: Moment;
    endDate: Moment;
    collapseActiveKey: string | Array<string>;
}

@inject('DeviceStore', 'KeyStore', 'ProjectStore') @observer
export default class DocumentationCollapse extends React.Component<IProps, IState>{

    constructor(props: IProps) {
        super(props)
        this.state = {
            response: [],
            startDate: moment().subtract(1, 'day'),
            endDate: moment(),
            collapseActiveKey: ['0']
        }
    }

    parseUrl = (url: string) => {
        return url.slice(7, url.length)
    }

    render() {
        const { selectedDevice } = this.props.DeviceStore!
        const { selectedKey } = this.props.KeyStore!
        const { selectedProject } = this.props.ProjectStore!
        const { response, startDate, endDate, collapseActiveKey } = this.state

        const getHeader = (url: string, key: number, mqtt?: boolean) => (
            <span>
                <Row>
                    <Col xs={14} sm={16} md={18} lg={22} xl={22}>
                        {mqtt ? <Tag color='#6d0d72'>MQTT</Tag> : <Tag color='#009933'>GET</Tag>}
                        <span style={{ wordWrap: 'break-word' }}><b>{url}</b></span>
                    </Col>
                    {!mqtt ?
                        <Col xs={{ span: 6, offset: 2 }}
                            sm={{ span: 6, offset: 2 }}
                            md={{ span: 4, offset: 2 }}
                            lg={{ span: 2, offset: 0 }}
                            xl={{ span: 2, offset: 0 }}>
                            <Button disabled={!selectedKey}
                                onClick={async (event: any) => {
                                    try {
                                        let activeKey = this.state.collapseActiveKey;
                                        if (!activeKey.includes(key.toString())) {
                                            activeKey = activeKey.concat(key.toString());
                                        }

                                        event.stopPropagation();
                                        const res: any = (await axios.get(this.parseUrl(url), { headers: { "auth": selectedKey!.uuid } })).data;
                                        let array: Array<any> = []
                                        array[key] = res
                                        await this.setState({ response: array, collapseActiveKey: activeKey })
                                    } catch (error) {
                                        message.error('Error, something went wrong')
                                    }
                                }} >  Try it out  </Button>
                        </Col>
                        : null}
                </Row>
            </span>
        )

        return (
            <div>
                <div >
                    <Collapse defaultActiveKey={['0']}
                        activeKey={collapseActiveKey}
                        onChange={(key: string | Array<string>) => {
                            this.setState({ collapseActiveKey: key })
                        }}>

                        <Collapse.Panel
                            header={getHeader(`/api/v1/integrations?device=${selectedDevice.uuid ? selectedDevice.uuid : ':deviceUuid'}`, 0)}
                            key="0">
                            Last transmission with respective measures
                            <CollapseTableParams data={[
                                { name: 'device', type: 'string', default: ' - ', description: 'Device ID to filter' },
                            ]} />
                            {response[0] && <ResponsePanel response={response[0]} />}
                        </Collapse.Panel >

                        <Collapse.Panel
                            header={getHeader(`/api/v1/integrations/search?device=${selectedDevice.uuid ? selectedDevice.uuid : ':deviceUuid'}&start=${startDate ? startDate.toISOString() : 'startDate'}&end=${endDate ? endDate.toISOString() : 'endDate'}`, 1)}
                            key="1">
                            <p> Device transmissions between dates</p>
                            <DatePicker.RangePicker defaultValue={[startDate, endDate]}
                                onChange={(date, dateString) => this.setState({ startDate: moment(dateString[0]), endDate: moment(dateString[1]) })} />
                            <CollapseTableParams data={[
                                { name: 'device', type: 'string', default: ' - ', description: 'Device ID to filter' },
                                { name: 'startDate', type: 'Date', default: ' - ', description: 'Start date' },
                                { name: 'endDate', type: 'Date', default: ' - ', description: 'End Date' },
                            ]} />
                            {response[1] && <ResponsePanel response={response[1]} />}
                        </Collapse.Panel >

                        <Collapse.Panel
                            header={getHeader(`/api/v1/integrations/projects`, 2)}
                            key="2">
                            Projects from an organization if you have permission
                            {response[2] && <ResponsePanel response={response[2]} />}
                        </Collapse.Panel >

                        {selectedProject &&
                            <Collapse.Panel
                                header={getHeader(`/api/v1/integrations/projects/${selectedProject ? selectedProject._id : ':projectId'}`, 3)}
                                key="3">
                                Project detail if you have permission
                                {response[3] && <ResponsePanel response={response[3]} />}
                            </Collapse.Panel >
                        }

                        {selectedProject &&
                            <Collapse.Panel
                                header={getHeader(`/api/v1/integrations/projects/${selectedProject ? selectedProject._id : ':projectId'}/devices`, 4)}
                                key="4">
                                Project devices if you have permission
                                {response[4] && <ResponsePanel response={response[4]} />}
                            </Collapse.Panel >
                        }

                        <Collapse.Panel
                            header={getHeader(`liberiot/publish/[organization uuid]/['prod'|'dev']/[device uuid]`, 5, true)}
                            key="5">
                            Liberiot MQTT uses TLS, you can try it with:
                            <b><pre>$ mosquitto_sub -h mqtt.liberiot.inubo.es -p 3001 -t '#' -v --capath /etc/ssl/certs/ -i {selectedKey ? selectedKey.uuid : '[API Key]'}</pre></b>
                            MQTT sample
                            Example url: <b><pre>liberiot/publish/aaaa-bbbb-cccc-9999-eeee/prod/zzzz-4444-yyyy--8888-xxxx</pre></b>
                            Response example <br />
                            <ReactJson src={exampleTransmission} collapsed={true} name={false} />
                        </Collapse.Panel >
                    </Collapse>
                </div>
            </div >
        )
    }
}
