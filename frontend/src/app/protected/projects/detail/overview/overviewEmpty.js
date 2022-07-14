import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Button from "antd/lib/button";
export default function OverviewEmptyComponent() {
    return (
        <Row className="layout-content" justify="start">
            <Col md={22} lg={18} xl={16} xxl={14}>
                <Col style={{fontSize: '20px', color: 'black'}}>Your project setup is complete.</Col>
                <Col style={{fontSize: '15px', color: 'black'}}>Next steps</Col>
                <Col>You can now start labeling the data or add members to this project and then start labeling.</Col>
                <Row >
                    <Button type="primary">Start Labeling</Button>
                    <Button type="default">Add Member</Button>
                </Row>
            </Col>
        </Row>
    );
}
