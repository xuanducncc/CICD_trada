import React from "react";
import PageLayout from "../../../components/PageLayout/PageLayout";
import useWorkspace, {
  withWorkspaceContext,
} from "./contexts/WorkspaceContext";
import WorkspaceEditor from "./components/WorkspaceEditor/WorkspaceEditor";
import QueueDrawer from "./components/QueueDrawer/QueueDrawer";
import { EditorProvider } from "./contexts/EditorContext";
import InstructionDrawer from "./components/Instruction/InstructionDrawer";

// import "./WorkspacePage.css";

const WorkspacePage = () => {
  const {
    error,
    loading,
    isReady,
    queueItems,
    instruction,
    currentId,
    selectQueueItem,
    drawerVisible,
    setDrawerVisible,
    instructionDrawerVisible,
    closeInstruction
  } = useWorkspace();

  return (
    <PageLayout
      loading={loading === "pending"}
      isReady={isReady}
      error={error}
      padding={0}
      height="100vh"
    >
      <EditorProvider>
        <WorkspaceEditor />
      </EditorProvider>
      <QueueDrawer
        workItems={queueItems}
        currentId={currentId}
        setCurrentId={selectQueueItem}
        drawerVisible={drawerVisible}
        setDrawerVisible={setDrawerVisible}
      />
      <InstructionDrawer
        instruction={instruction}
        drawerVisible={instructionDrawerVisible}
        onClose={closeInstruction}
      />
    </PageLayout>
  );
};

export default WorkspacePage;
