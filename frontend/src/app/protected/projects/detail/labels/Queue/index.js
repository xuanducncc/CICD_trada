import { useSearchParams } from "@core/hooks/useSearchParams";
import { WORK_ITEM_STATUS } from "@utils/const";
import React from "react";
import QueuePage from "./Queue";
import { ProjectDetailQueueProvider } from "./QueueContext";

const ProjectDetailQueueWithContext = () => {
  const {
    status = WORK_ITEM_STATUS.PENDING,
    page = 1,
    label,
  } = useSearchParams();

  return (
    <ProjectDetailQueueProvider status={status} page={page} label={label}>
      <QueuePage />
    </ProjectDetailQueueProvider>
  );
};

export default ProjectDetailQueueWithContext;
