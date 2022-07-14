import React, { useCallback } from "react";
import Button from "antd/lib/button";
import { useHistory } from "react-router-dom";
import useProjectDetail from "./ProjectDetailContext";
import useProtected from "@components/Protected/ProtectedContext";

const StartLabelingButton = () => {
  const history = useHistory();
  const {
    projectId,
    memberId,
    queueLabelId,
    labelAvailable,
    memberGetQueueLabel,
    numberRejected,
  } = useProjectDetail();

  const handleStartLabeling = useCallback(async () => {
    if (queueLabelId) {
      history.push(`/i/projects/${projectId}/workspace/?qid=${queueLabelId}`);
    } else if (numberRejected > 0) {
      history.push(`/i/projects/${projectId}/workspace/`);
    } else {
      const result = await memberGetQueueLabel(memberId);
      if (result.error) {
        return;
      }
      const queueId = result?.payload?.queueId;
      if (queueId) {
        history.push(
          `/i/projects/${projectId}/workspace/?qid=${queueId}`
        );
      }
    }
  }, [history, projectId, queueLabelId]);

  return (
    <Button
      disabled={!labelAvailable}
      onClick={handleStartLabeling}
      type="primary"
    >
      Start Labeling
    </Button>
  );
};

export default StartLabelingButton;
