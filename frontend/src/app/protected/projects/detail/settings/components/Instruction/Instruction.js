import { Button, Col, Input, Row, Divider } from "antd";
import Form from "antd/lib/form";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone"
import { FilePdfOutlined, UploadOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { List, Avatar } from 'antd';
import useProjectDetailSettingInstruction, { withProjectDetailSettingInstructionContext } from "./ProjectDetailSettingInstructionContext";
import InstructionDrawer from "./InstructionDrawer";

const Instruction = () => {
  const [fileInfor, setFileInfor] = useState({});
  const [drawerVisible, setDrawerVisible] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    setFileInfor({ title: acceptedFiles[0].name, file: acceptedFiles[0] })
  }, [setFileInfor, fileInfor]);

  const { instruction_list, instruction_item, addInstruction, loading, fetchInstructionItem } = useProjectDetailSettingInstruction();

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop,
    accept: 'application/pdf'
  });
  return (
    <div style={{ backgroundColor: "white" }}>
      <Row>
        <Col span={6}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button icon={<UploadOutlined />}>
              Attach instruction
            </Button>
          </div>
          {fileInfor.title ? (
            <Row style={{ marginTop: "20px" }}>
              <Text>{fileInfor.title}</Text>
            </Row>
          ) : <></>}
        </Col>
        <Col style={{ paddingLeft: "20px" }}>
          <Button
            disabled={!fileInfor.file}
            loading={loading === "pending"}
            type="primary"
            onClick={() => { addInstruction(fileInfor) }}
          >
            Upload
          </Button>
        </Col>
      </Row>
      <Divider style={{ marginTop: "50px" }} orientation="left">List instruction</Divider>
      {instruction_list.length !== 0 && (
        <List
          size="small"
          itemLayout="horizontal"
          dataSource={instruction_list}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta

                style={{ cursor: "pointer" }}
                avatar={<FilePdfOutlined />}
                title={<p onClick={async () => {
                  await fetchInstructionItem(item.id);
                  setDrawerVisible(true)
                }}>{item.title}</p>}
              />
            </List.Item>
          )}
        />
      )}
      <InstructionDrawer
        instruction={instruction_item}
        drawerVisible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
};

export default withProjectDetailSettingInstructionContext(Instruction);
