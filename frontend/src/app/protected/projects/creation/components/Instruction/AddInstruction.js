import { Button, Col, Input, Row } from "antd";
import Form from "antd/lib/form";
import React, { useCallback, useState } from "react";
import useAddInstruction, { withAddInstructionContext } from "./AddInstructionContext";
import { useDropzone } from "react-dropzone"
import { UploadOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";

const AddInstruction = () => {
  const [fileInfor, setFileInfor] = useState({});

  const onDrop = useCallback(acceptedFiles => {
    setFileInfor({ title: acceptedFiles[0].name, file: acceptedFiles[0] })
  }, [setFileInfor, fileInfor]);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    onDrop,
    accept: 'application/pdf'
  });

  const { addInstruction, instruction, loading } = useAddInstruction()
  return (
    <div style={{ padding: "0px 49px", backgroundColor: "white" }}>
      <p style={{ paddingBottom: "20px", borderBottom: "1px solid #EEF2F7" }}>
        Instruction for labeler to label item.
      </p>
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
          ) : instruction.title ? (
            <Row style={{ marginTop: "20px" }}>
              <Text>{instruction.title}</Text>
            </Row>
          ) : <></>}
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Button
          type="primary"
          onClick={() => addInstruction(fileInfor)}
          loading={loading === "pending"}
        >
          Create Instruction
          </Button>
      </Row>
      <Row>

      </Row>
    </div>
  );
};

export default withAddInstructionContext(AddInstruction);
