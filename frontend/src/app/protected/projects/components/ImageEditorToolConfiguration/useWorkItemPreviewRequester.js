import { projectsSelectors } from "@core/redux/projects";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAsyncEffect from "use-async-effect";

export default function useWorkItemPreviewRequester() {
  const { editor, editorData } = useSelector(projectsSelectors.selectProjectMutationPreview);
  const { editorDetail, editorDataDetail } = useSelector(projectsSelectors.selectProjectDetailPreview);
  const loading = false;
  const error = null;

  const updateWorkItem = useCallback((item) => {
  }, []);

  const submitWorkItem = useCallback((item) => {
  }, []);

  const skipWorkItem = useCallback((item) => {
  }, []);

  return {
    error,
    editor,
    loading,
    editorData,
    editorDetail,
    editorDataDetail,
    updateWorkItem,
    submitWorkItem,
    skipWorkItem,
  };
}
