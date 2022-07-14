import { ArrowLeftOutlined } from "@ant-design/icons";
import PageHeaderLayout from "@components/PageHeader/PageHeader";
import PageLayout from "@components/PageLayout/PageLayout";
import { Button } from "antd";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Tabs from "antd/lib/tabs";
import Text from "antd/lib/typography/Text";
import React from "react";
import { useHistory } from "react-router";
import './style.css';
import UserProfileActivity from "./UserProfileActivity";
import useUserProfile from "./UserProfileContext";
import UserProfileInfo from './UserProfileInfo';
import UserProfileUsage from './UserProfileUsage';

const UserProfilePage = () => {
    const { userDetail, userPerformance, loading, error } = useUserProfile();
    const history = useHistory();
    return (
        <Row className="layout-content" justify="space-around">
            <Col md={22} lg={18} xl={16} xxl={14}>
                <Tabs>
                    <Tabs.TabPane
                        tab={
                            (
                                <span>
                                    <Button onClick={() => history.goBack()} type="text" icon={<ArrowLeftOutlined />}></Button>
                                    <Text>Personal detail</Text>
                                </span>
                            )
                        }
                        key='1'
                    >
                        <PageLayout
                            padding={0}
                            loading={loading === "pending"}
                            isReady={loading === "fulfilled"}
                            error={error}
                            height="60vh"
                        >
                            <UserProfileInfo user={userDetail} performance={userPerformance} />
                        </PageLayout>
                    </Tabs.TabPane>
                    {/* <Tabs.TabPane
                        tab={
                            (
                                <span>
                                    <Text>Usage</Text>
                                </span>
                            )
                        }
                        key='2'
                    >
                        <UserProfileUsage />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            (
                                <span>
                                    <Text>Activity</Text>
                                </span>
                            )
                        }
                        key='3'
                    >
                        <UserProfileActivity />
                    </Tabs.TabPane> */}
                </Tabs>
            </Col>
        </Row>
    );
};

export default UserProfilePage;
