import React, { useCallback, useEffect, useState } from "react";
import Button from "antd/lib/button";
import useImageEditorToolConfiguration from "./ImageEditorToolConfigurationContext";
import { styled } from "@material-ui/styles";
import { IMAGE_ANNOTATION_TYPE } from "@utils/const";
import ImageEditorObjectPane from "./ImageEditorObjectPane";
import ImageEditorClassificationPane from "./ImageEditorClassificationPane";

const ImageEditorToolConfigurationToolDetailWrapper = styled("div")({});

const ImageEditorToolConfigurationToolDetail = ({ setDrawer }) => {
  const {
    setActivatedTool,
    activatedTool,
    updateTool,
    tools,
    setTools
  } = useImageEditorToolConfiguration();
  const formRef = React.useRef();
  const [draftedTool, setDraftedTool] = useState(null);

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    setDrawer(true);
    handleCancel()
  }

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  const handleCancel = useCallback(() => {
    const newTools = tools.filter(tool => tool.name !== "");
    setTools(newTools)
    setActivatedTool(null);
  }, [setActivatedTool]);

  const handleConfirm = useCallback(() => {
    formRef?.current?.validateFields().then(values => {
      updateTool(draftedTool);
      setActivatedTool(null);
    }).catch(error => {
    })
  }, [draftedTool, updateTool, setActivatedTool, formRef.current]);

  const handleChangeDraftedTool = useCallback(
    (tool) => {
      const labels = draftedTool.labels;
      if (tool.labels) {
        for (let index = 0; index < tool.labels.length; index++) {
          const label = tool.labels[index];
          if (label && label.name !== "") {
            labels[index] = label;
          }
        }
      }
      setDraftedTool({ ...draftedTool, ...tool, labels });
    },
    [draftedTool, setDraftedTool]
  );

  useEffect(() => {
    setDraftedTool({ ...activatedTool });
  }, [activatedTool, setDraftedTool]);

  return (
    <ImageEditorToolConfigurationToolDetailWrapper>
      <div>
        <h3>
          Setup Tool: {draftedTool && draftedTool.name ? draftedTool.name : ""}
        </h3>
      </div>
      <div>
        {draftedTool &&
          draftedTool.type === IMAGE_ANNOTATION_TYPE.DETECTION && (
            <ImageEditorObjectPane
              tool={draftedTool}
              onChange={handleChangeDraftedTool}
              formRef={formRef}
            />
          )}
        {draftedTool &&
          draftedTool.type === IMAGE_ANNOTATION_TYPE.CLASSIFICATION && (
            <ImageEditorClassificationPane
              tool={draftedTool}
              onChange={handleChangeDraftedTool}
              formRef={formRef}
            />
          )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Button onClick={handleCancel} type="default">
          Cancel
        </Button>
        <Button onClick={handleConfirm} type="primary">
          Confirm
        </Button>
      </div>
    </ImageEditorToolConfigurationToolDetailWrapper>
  );
};

export default ImageEditorToolConfigurationToolDetail;
