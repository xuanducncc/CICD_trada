import React, { useCallback } from "react";
import Button from "antd/lib/button";
import { useHistory } from "react-router-dom";
import useProjectDetail from "./ProjectDetailContext";
import useProtected from "@components/Protected/ProtectedContext";

const StartReviewingButton = () => {
  const history = useHistory();
  const {
    projectId,
    memberId,
    queueReviewId,
    reviewAvailable,
    memberGetQueueReview,
  } = useProjectDetail();

  const handleStartReviewing = useCallback(async () => {
    if (queueReviewId) {
      history.push(`/i/projects/${projectId}/review/${queueReviewId}`);
    } else {
      const result = await memberGetQueueReview(memberId);
      if (result.error) {
        return;
      }
      const queueId = result?.payload?.queueId;
      if (queueId) {
        history.push(`/i/projects/${projectId}/review/${queueId}`);
      }
    }
  }, [history, projectId, queueReviewId]);

  return (
    <Button
      disabled={!reviewAvailable}
      onClick={handleStartReviewing}
      key="0"
      type="primary"
    >
      Start Reviewing
    </Button>
  );
};

export default StartReviewingButton;
