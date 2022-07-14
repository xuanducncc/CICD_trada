import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import useWorkItemRequester from "@core/hooks/useWorkItemRequester";
import useReview from "../../ReviewPageContext";

const ReviewEditorContext = createContext({
  editor: null,
  editorData: null,
  loading: null,
  error: null,
  workItemDetail: null,
  voteDownLabeledItem: null,
  voteUpLabeledItem: null,
  selectedLabeledItemId: null,
  selectLabeledItemId: null,
});

export const ReviewEditorProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { currentId, memberId } = useReview();

  const {
    loading,
    error,
    editor,
    editorData,
    selectedLabeledItemId,
    voteDownLabeledItem,
    voteUpLabeledItem,
    selectLabeledItemId,
  } = useWorkItemRequester({
    id: currentId,
    memberId,
  });

  const contextValue = useMemo(
    () => ({
      editor,
      loading,
      error,
      editorData,
      selectedLabeledItemId,
      selectLabeledItemId,
      voteDownLabeledItem,
      voteUpLabeledItem,
    }),
    [
      editor,
      loading,
      error,
      editorData,
      selectedLabeledItemId,
      selectLabeledItemId,
      voteDownLabeledItem,
      voteUpLabeledItem,
    ]
  );

  return (
    <ReviewEditorContext.Provider value={contextValue}>
      {children}
    </ReviewEditorContext.Provider>
  );
};

export function withReviewEditorContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ReviewEditorProvider>
        <Component {...props} />
      </ReviewEditorProvider>
    );
  };
}

export const useReviewEditor = () => useContext(ReviewEditorContext);

export default useReviewEditor;
