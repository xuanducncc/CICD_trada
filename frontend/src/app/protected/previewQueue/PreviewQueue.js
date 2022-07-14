import React, { useCallback } from "react";
import { styled } from "@material-ui/styles";
import QueueDrawer from "./QueueDrawer/QueueDrawer";
import usePreviewQueue from "./PreviewQueueContext";
import PreviewEditor from "./PreviewEditor";

const PreviewQueuePageLayout = styled("div")({
  padding: "0px",
  display: "flex",
  height: "100vh",
});

const PreviewQueuePageSidebar = styled("div")({
  padding: "0px",
  width: "400px",
  backgroundColor: "white",
  height: "100%",
});

const PreviewQueuePageContent = styled("div")({
  padding: "0px",
  width: "calc(100% - 400px)",
  height: "100%",
});

const PreviewQueue = () => {
  const { queueItems, currentId, selectQueueItem } = usePreviewQueue();
  return (
    <PreviewQueuePageLayout>
      <PreviewQueuePageSidebar>
        <QueueDrawer
          workItems={queueItems}
          currentId={currentId}
          setCurrentId={selectQueueItem}
        />
      </PreviewQueuePageSidebar>
      <PreviewQueuePageContent>
        <PreviewEditor />
      </PreviewQueuePageContent>
    </PreviewQueuePageLayout>
  );
};

export default PreviewQueue;
