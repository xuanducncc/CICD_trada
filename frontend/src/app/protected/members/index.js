import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Input from "antd/lib/input";
import Row from "antd/lib/row";

import Text from "antd/lib/typography/Text";
import PageLayout from "../../../components/PageLayout/PageLayout";
import DropdownMenu from "../projects/detail/overview/DropdownMenu";
import React from "react";
import { useHistory } from "react-router";

export default function MemberPageComponent(props) {
    const { OnChangeForm, formData, handleSubmitForm, isDisable, isMine, data, tabs } = props;
    const history = useHistory();

    return (
        <PageLayout>
            <Row className="layout-content" justify="center">
                <Col md={22} lg={18} xl={16} xxl={14}>
                    <Row justify="space-between">
                        <h1>{!data ? "Add member" : data.email}</h1>
                        <Button onClick={() => history.push("/i/f/members")}>X</Button>
                    </Row>
                    <hr />
                    <Row>
                        <Col>
                            {!data && <Col>
                                <Input
                                    placeholder="Enter an email"
                                    onChange={OnChangeForm}
                                    value={formData.email}
                                ></Input>
                                <Col className="layout-content-text-title">Commas and/or spaces can be used to separate multiple emails</Col>
                            </Col>}
                            <br />
                            <Col className="trada-custom-date">Organization role</Col>
                            <Col className="layout-content-text-title">Grants the user access to all current and future projects with the selected role.</Col>
                            <br />
                            {isMine && <Text className="layout-content-text-title" type="danger">You can not modify your own organization role.</Text>}
                            <Col>
                                <DropdownMenu
                                    data={tabs}
                                    mapDataFromKey={OnChangeForm}
                                    disabled={isMine}
                                    placeholder="select a role"
                                />
                            </Col>
                            <Col className="layout-content-text-title">Labeler can create and review own labels.</Col>
                            <br />
                            <Col><Button type="primary" disabled={isDisable} onClick={handleSubmitForm}>Invite</Button></Col>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageLayout>
    );
}