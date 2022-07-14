import React from "react";
import ReviewChooseData from "./reviewChooseData";
import ReviewConfigureEditor from "./reviewConfigureEditor";
import ReviewProjectInfo from "./reviewProjectInfor";
import ReviewSelectSettings from "./reviewSelectSettings";
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Button from 'antd/lib/button';
import { Progress, Result, Alert } from "antd";
import pending from "@assets/images/Paper-airplane-icon.png";
import success from "@assets/images/success-icon.png";
import errorIcon from "@assets/images/error-icon.png";
import useFinishProject, { withFinishProjectContext } from "./FinishProjectContext";
const Finish = () => {
    const { finishProject, loading, goToProject, error } = useFinishProject();
    return (
        <Row justify="center" align="stretch" style={{ marginTop: "0" }}>
            {/* <ReviewProjectInfo />
            <ReviewChooseData />
            <ReviewConfigureEditor />
            <ReviewSelectSettings /> */}
            {/* <Result
                // status="success"
                icon={<Progress type="circle" percent={100} />}
                title="almost done!"
                subTitle="Click to finish create new project!"
                extra={[
                    <Button type="primary" key="console" onClick={finishProject}>
                        Finish
                </Button>,
                ]}
            /> */}
            {loading === "rejected" ? (<Row>
                <Col span={24} >
                    <Result
                        icon={<img style={{ width: '50%', height: '50%' }} src={errorIcon} />}
                        title="Something error!"
                        subTitle="error when create new project!"
                    />
                </Col>
                <Col span={12} offset={6} >
                    {error &&
                        <Alert
                            style={{ marginBottom: '20px', textAlign: 'center' }}
                            message={error}
                            // description={error}
                            type="error"
                        />}
                </Col>
            </Row>
            ) : loading === "fulfilled" ? (
                <Result
                    icon={<img style={{ width: '50%', height: '50%' }} src={success} />}
                    title="Create Project Successfully!"
                    subTitle="Now, you can start working on your new project!"
                    extra={[
                        <Button type="primary" key="console" onClick={goToProject}>
                            Go to project
                        </Button>,
                    ]}
                />
            ) : (
                <Result
                    icon={<img style={{ width: '50%', height: '50%' }} src={pending} />}
                    title="almost done!"
                    subTitle="Click to finish create new project!"
                    extra={[
                        <Button type="primary" key="console" onClick={finishProject}>
                            Finish
                        </Button>,
                    ]}
                />
            )}
        </Row>
    )
}

export default withFinishProjectContext(Finish);
