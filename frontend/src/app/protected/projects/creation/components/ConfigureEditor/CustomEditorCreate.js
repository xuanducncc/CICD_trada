import React, { useState } from "react";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
export default function CustomEditorCreate() {
    const [isUrl, setUrl] = useState(false);
    const messageUrl = `Since labelbox is served over "https" we won't be able to send commands to your custom interface if it's served over "http". Don't worry, follow these easy instructions to setup https.!`;
    const onFinish = (values) => {
        if(!isUrl) {
            console.log('Failed:', values);
            return;
        } else {
            console.log('Success:', values);
        }
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const isValidURL = (string) => {
        var res = string.match(/\b((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/g);
        return (res !== null)
    };
    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    return(
        <Col>
            <Row>
                <Col flex="2">
                    <p className="custom-editor-create-font">Installing a custom template</p>
                    <p>If the example templates aren’t sufficient for your needs, you can simply build your own custom template with just HTML and javascript.</p>
                    <a><p>Learn more</p></a>
                </Col>
                <Col flex="3">
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    >
                    <Form.Item
                        label="Username"
                        name="username"
                        hasFeedback
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        hasFeedback
                        rules={[{ required: true, message: 'Please input your description!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    
                    <Form.Item
                        label="URL to label editor"
                        name="url"
                        hasFeedback
                        validateStatus={isUrl?"success":"error"}
                        help={!isUrl && messageUrl}
                        rules={[
                            { 
                                required: true,
                                message: messageUrl 
                            }
                        ]}
                    >
                        <Input onChange={(r)=> {
                            const url = isValidURL(r.target.value);
                            setUrl(url);
                        }}/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
                </Col>
            </Row>
        </Col>
    );
}