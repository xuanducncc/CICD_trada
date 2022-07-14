import React from "react";
import QueueDrawer from "./components/Queue/QueueDrawer";
import WorkspaceEditor from "./components/workspace";
import { styled } from "@material-ui/styles";
import PageLayout from "@components/PageLayout/PageLayout";
import useReview from "./ReviewPageContext";

const ReviewPage = () => {
  const {
    queueItems,
    currentId,
    selectQueueItem,
    drawerVisible,
    setDrawerVisible,
    loading,
    error,
    isReady,
  } = useReview();
  return (
    <PageLayout padding={0} loading={!isReady} error={error} height="100vh">
      <WorkspaceEditor />
      <QueueDrawer
        workItems={queueItems}
        currentId={currentId}
        setCurrentId={selectQueueItem}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />
    </PageLayout>
  );
};

export default ReviewPage;
