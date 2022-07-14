import { useSearchParams } from "@core/hooks/useSearchParams";
import { QUEUE_STATUS } from "@utils/const";
import React from "react";
import ValidationPage from "./Validation";
import { ValidationProvider } from "./ValidationContext";

const ProjectDetailValidationWithContext = () => {
  const { page = 1, status = QUEUE_STATUS.VALIDATION } = useSearchParams();
  return (
    <ValidationProvider page={page} status={status}>
      <ValidationPage />
    </ValidationProvider>
  );
};

export default ProjectDetailValidationWithContext;
