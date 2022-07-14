import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Table from 'antd/lib/table';
import Text from 'antd/lib/typography/Text';
import React from 'react';
export default function UserProfileUsage() {
    const column = [
        {
            title: 'Type',
            key: 'type',
            dataIndex: 'type',
        },
        {
            title: 'Usage',
            key: 'usage',
            dataIndex: 'usage',
            width: '12%',
        }
    ];
    const data = [
        {
            type: 'Labels',
            usage: '12',
        },
        {
            type: 'Users',
            usage: '6',
        },
        {
            type: 'Projects',
            usage: '2',
        }
    ]
    const columnLabel = [
        {
            title: 'Organization',
            key: 'organization',
            dataIndex: 'organization',
        },
        {
            title: 'Last updated',
            key: 'last_updated',
            dataIndex: 'last_updated',
            width: '20%',
        },
        {
            title: 'Labels',
            key: 'labels',
            dataIndex: 'labels',
            width: '15%',
        },
        {
            title: 'Labeling time',
            key: 'labeling_time',
            dataIndex: 'labeling_time',
            width: '15%',
        }
    ];
    const dataLabel = [
        {
            organization: 'Internal',
            last_updated: '1 day ago',
            labels: '22',
            labeling_time: '3m',
        }
    ]
    return (
        <Row className="layout-content trada-user-profile" justify='start'>
            <Col md={24}>
                <Row><Text className="trada-user-profile-text">Organization usage</Text></Row>
                <Table dataSource={data} columns={column} size="small" pagination={false}></Table>
                <br />
            </Col>

            <Col md={24}>
                <Row><Text className="trada-user-profile-text">Labeling breakdown</Text></Row>
                <Table dataSource={dataLabel} columns={columnLabel} size="small" pagination={false}></Table>
            </Col>
        </Row>
    );
}
