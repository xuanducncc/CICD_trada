import ImageAnnotate from "@libs/image-annotate/ImageAnnotate";
import { styled } from "@material-ui/styles";
import React from "react";
import useImageEditorToolConfiguration from "./ImageEditorToolConfigurationContext";
import useWorkItemPreviewRequester from "./useWorkItemPreviewRequester";

const ImageEditorToolConfigurationPreviewWrapper = styled("div")({
  background: "white",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ImageEditorToolConfigurationPreview = ({ isSetting }) => {
  const { dismiss }= useImageEditorToolConfiguration();
  const { editorData, editor, loading, error, editorDataDetail, editorDetail } = useWorkItemPreviewRequester();
  return (
    <ImageEditorToolConfigurationPreviewWrapper>
      <ImageAnnotate
        mode='annotate'
        data={isSetting ? editorDataDetail : editorData}
        config={isSetting ? editorDetail : editor}
        loading={loading}
        error={error}
        onBack={dismiss}
        onNext={false}
        onPrev={false}
        onQueue={false}
        onSubmitWorkItem={false}
        onSkipWorkItem={false}
      />
    </ImageEditorToolConfigurationPreviewWrapper>
  );
};

export default ImageEditorToolConfigurationPreview;
