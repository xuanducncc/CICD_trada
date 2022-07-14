import React, { useCallback } from "react";
import WorkspaceEditor from "./Components/ValidationEditor";
import QueueDrawer from "./Components/QueueDrawer/QueueDrawer";
import useValidationItemQueue, {
  ValidationItemQueueProvider,
} from "./ValidationItemQueueContext";
import { styled } from "@material-ui/styles";

const ValidationItemPageLayout = styled("div")({
  padding: "0px",
  display: "flex",
  height: "100vh",
});

const ValidationItemPageSidebar = styled("div")({
  padding: "0px",
  width: "500px",
  backgroundColor: "white",
  height: "100%",
});

const ValidationItemPageContent = styled("div")({
  padding: "0px",
  width: "calc(100% - 500px)",
  height: "100%",
});

const ValidationItemQueue = () => {
  const { queueItems, currentId, selectQueueItem } = useValidationItemQueue();

  return (
    <ValidationItemPageLayout>
      <ValidationItemPageSidebar>
        <QueueDrawer
          workItems={queueItems}
          currentId={currentId}
          setCurrentId={selectQueueItem}
        />
      </ValidationItemPageSidebar>
      <ValidationItemPageContent>
        <WorkspaceEditor />
      </ValidationItemPageContent>
    </ValidationItemPageLayout>
  );
};

export default ValidationItemQueue;
