import React, { useCallback } from "react";
import Button from "antd/lib/button";
import { useHistory } from "react-router-dom";
import useProjectDetail from "./ProjectDetailContext";
import useProtected from "@components/Protected/ProtectedContext";

const StartValidatingButton = () => {
  const history = useHistory();
  const {
    projectId,
    validateAvailable,
  } = useProjectDetail();

  const handleStartValidation = useCallback(async () => {
    history.push(
      `/i/projects/${projectId}/labels/validation`
    );
  }, [history, projectId]);

  return (
    <Button
      disabled={!validateAvailable}
      onClick={handleStartValidation}
      type="primary"
    >
      Start Validating
    </Button>
  );
};

export default StartValidatingButton;
