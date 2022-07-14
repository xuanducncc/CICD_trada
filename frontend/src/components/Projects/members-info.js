import useMemberPage, { withMemberPageContext } from '@app/protected/members/MemberPageContext';
import PageLayout from '@components/PageLayout/PageLayout';
import useUsersListRequester from '@core/hooks/useUsersListRequester';
import Button from 'antd/lib/button'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Table from 'antd/lib/table'

import Text from "antd/lib/typography/Text";
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
const MembersInfoComponent = () => {
    const history = useHistory();
    const historyCallback = useCallback(() => history.push("/i/members/new"));
    const { users, loading, error } = useUsersListRequester({});
    const data = users;

    const renderRole = (is_superuser) => {
        return is_superuser ? <Text>admin</Text> : <Text>labeler</Text>
    }
    const columns = [
        {
            title: 'Name',
            key: 'username',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
        },
        {
            title: 'Role',
            key: 'is_superuser',
            dataIndex: 'is_superuser',
            render: renderRole
        },
    ];
    return (
        <Col>
            <Row align="top" justify="space-between" style={{ marginBottom: "20px" }}>
                <Row><Text style={{ fontSize: '20px', color: 'black' }}>All Members</Text></Row>
                {/* <Button type="primary" onClick={historyCallback}>New Member</Button> */}
            </Row>
            <PageLayout
                padding={0}
                loading={loading === "pending"}
                isReady={loading === "fulfilled"}
                empty={error}
                height="60vh"
            >
                <Table
                    dataSource={data}
                    columns={columns}
                    size="small"
                    onRow={(row) => ({
                        onClick: () => history.push(`/i/user/${row.id}/profile`)
                    })}
                    showHeader={true}
                ></Table>
            </PageLayout>
        </Col>
    )
}

export default MembersInfoComponent;
