import React, { useCallback, useEffect } from "react";
import { ImageAnnotateProvider } from "./contexts/ImageAnnotateContext";
import { Stage, Layer, Star, Text } from "react-konva";
import ImageCanvas from "./components/ImageCanvas/ImageCanvas";
import ImageAnnotations from "./components/ImageAnnotations/ImageAnnotations";
import SketchBoard from "./components/SketchBoard/SketchBoard";
import SideBar from "./components/SideBar/SideBar";
import ControlBar from "./components/ControlBar/ControlBar";
import { ImageAnnotateHotkeyStorageProvider } from "./contexts/ImageAnnotateHotkeysContext";
import Layout from "antd/lib/layout";
import { styled } from "@material-ui/styles";

const ImageAnnotateLayout = styled("div")({
  padding: "0px",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  flex: 1,
});

const ImageAnnotateSidebar = styled("div")({
  padding: "0px",
});

const ImageAnnotateContent = styled("div")({
  padding: "0px",
  flex: "1",
  display: "flex",
  flexDirection: "row",
});

const ImageAnnotateContentTopBar = styled("div")({
  padding: "0px",
});

const ImageAnnotateContentCanvas = styled("div")({
  padding: "0px",
  flex: "1",
  display: "flex",
});

const ImageAnnotate = ({
  mode = 'annotate',
  data,
  config,
  onBack,
  onQueue,
  onInstruction,
  onNext,
  onPrev,
  loading,
  error,
  onToFirst,
  onToLast,
  onSkipWorkItem,
  onSubmitWorkItem,
  onVoteUpLabeledItem,
  onVoteDownLabeledItem,
  defaultLabeledItemId,
  onSelectLabeledItem,
}) => {
  return (
    <ImageAnnotateProvider
      mode={mode}
      data={data}
      error={error}
      loading={loading}
      config={config}
      onBack={onBack}
      onNext={onNext}
      onPrev={onPrev}
      onQueue={onQueue}
      onInstruction={onInstruction}
      onToFirst={onToFirst}
      onToLast={onToLast}
      onSkipWorkItem={onSkipWorkItem}
      onSubmitWorkItem={onSubmitWorkItem}
      defaultLabeledItemId={defaultLabeledItemId}
      onSelectLabeledItem={onSelectLabeledItem}
      onVoteUpLabeledItem={onVoteUpLabeledItem}
      onVoteDownLabeledItem={onVoteDownLabeledItem}
    >
      <ImageAnnotateHotkeyStorageProvider>
        <ImageAnnotateLayout>
          <ImageAnnotateContentTopBar>
            <ControlBar />
          </ImageAnnotateContentTopBar>
          <ImageAnnotateContent>
            <ImageAnnotateSidebar>
              <SideBar />
            </ImageAnnotateSidebar>
            <ImageAnnotateContentCanvas>
              <SketchBoard />
            </ImageAnnotateContentCanvas>
          </ImageAnnotateContent>
        </ImageAnnotateLayout>
      </ImageAnnotateHotkeyStorageProvider>
    </ImageAnnotateProvider>
  );
};

export default ImageAnnotate;
