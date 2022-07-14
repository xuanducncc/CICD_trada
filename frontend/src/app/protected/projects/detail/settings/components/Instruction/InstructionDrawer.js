import React, { useState } from "react";
import Drawer from "antd/lib/drawer";
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import Text from "antd/lib/typography/Text";
import { Button, Row, Col } from "antd";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const InstructionDrawer = ({
  drawerVisible,
  setDrawerVisible,
  instruction
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.25)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages + 1);
  }

  return (
    <Drawer
      title={
        <Row>
          <Text>Instruction</Text>
          <Col style={{ marginLeft: "20px" }}>
            <Button id="zoomInButton" onClick={() => setScale(scale + 0.25)} icon={<ZoomInOutlined />}></Button>
            <Button id="zoomOutButton" onClick={() => setScale(scale - 0.25)} icon={<ZoomOutOutlined />}></Button>
          </Col>
        </Row>
      }
      placement="right"
      closable={true}
      width={800}
      onClose={() => setDrawerVisible(false)}
      visible={drawerVisible}
    >
      { instruction ? (
        <Document
          file={instruction}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.apply(null, Array(numPages))
            .map((x, i) => i + 1)
            .map(page => <Page scale={scale} key={page} pageNumber={page} />)}
        </Document>
      ) : (
        <Text>No instruction for this editor</Text>
      )}
    </Drawer>
  );
};

export default InstructionDrawer;
