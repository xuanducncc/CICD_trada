import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Drawer from "antd/lib/drawer";
import React, { useCallback, useState, useEffect } from "react";
import { FileImageTwoTone } from "@ant-design/icons";
import ImageEditorToolConfiguration from "@app/protected/projects/components/ImageEditorToolConfiguration/ImageEditorToolConfiguration";
import { ImageEditorToolConfigurationProvider } from "@app/protected/projects/components/ImageEditorToolConfiguration/ImageEditorToolConfigurationContext";
import useProjectCreation from "@app/protected/projects/creation/ProjectCreationContext";
import useProjectDetailSettingEditor, { withProjectDetailSettingEditorContext } from "./ProjectDetailSettingEditorContext";
const LabelEditorPage = () => {
    const { editor, setProjectEditor, setProjectDetailPreview } = useProjectDetailSettingEditor();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const onBackButtonEvent = (e) => {
        e.preventDefault();
        setDrawer(false);
        window.history.pushState(null, null, window.location.pathname);
    }

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);
        return () => {
            window.removeEventListener('popstate', onBackButtonEvent);
        };
    }, []);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );
    const [drawer, setDrawer] = useState(false);
    const showDrawer = () => {
        setDrawer(true);
    };
    const onClose = () => {
        setDrawer(false);
    };

    const [visible, setVisible] = useState(false);

    const handleDrawerDismiss = useCallback(() => {
        setDrawer(false);
    }, [setDrawer]);

    const handleSubmit = useCallback((tools) => {
        setProjectEditor(tools);
        setDrawer(false);
    }, [setProjectEditor, setDrawer]);

    const handlePreview = useCallback(
        (editorDetail) => {
            const editorDataDetail = {
                workItem: {
                    project_id: 0,
                    id: 0,
                    row: {
                        dataset_id: 0,
                        id: 0,
                        image:
                            "https://images.ctfassets.net/cnu0m8re1exe/7sLmeD1tcL4UoIm0BjNaLh/22a9f42a4315361db96470f50b178e86/Dog-and-Cat.jpg?w=650&h=433&fit=fill",
                    },
                    status: "PENDING",
                    type: "ORIGIN",
                    labeledItems: [],
                },
                mediaUrl:
                    "https://images.ctfassets.net/cnu0m8re1exe/7sLmeD1tcL4UoIm0BjNaLh/22a9f42a4315361db96470f50b178e86/Dog-and-Cat.jpg?w=650&h=433&fit=fill",
            };
            setProjectDetailPreview({ editorDetail, editorDataDetail });
        },
        [setDrawer]
    );

    return (<>
        <Col style={{ border: "1px solid #7fb4e2", padding: "15px", background: "aliceblue" }}>
            <Row justify="space-between">
                <Row>
                    <Col>
                        <FileImageTwoTone style={{ fontSize: "40px" }} />
                    </Col>
                    <Col>
                        <Row>Editor</Row>
                        <Row color="#1890ff">Images, video, and text</Row>
                    </Col>
                </Row>
                <Row>
                    <Button onClick={showDrawer} type="primary">Edit</Button>
                </Row>
            </Row>
        </Col>
        <Drawer
            width={window.innerWidth}
            style={{ height: `100%` }}
            placement="right"
            closable={false}
            onClose={onClose}
            visible={drawer}
            bodyStyle={{ padding: "0px" }}
        >
            <ImageEditorToolConfigurationProvider
                editor={editor}
                onSubmit={handleSubmit}
                onDismiss={handleDrawerDismiss}
                onPreview={handlePreview}
            >
                <ImageEditorToolConfiguration isSetting={true} setDrawer={setDrawer} />
            </ImageEditorToolConfigurationProvider>
        </Drawer>
    </>
    );
}

export default withProjectDetailSettingEditorContext(LabelEditorPage)
