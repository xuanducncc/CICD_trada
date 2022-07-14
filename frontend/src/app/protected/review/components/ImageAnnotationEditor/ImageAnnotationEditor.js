import React, { useCallback, useMemo, useState } from "react";
import Button from "antd/lib/button";
import ImageAnnotate from "@libs/image-annotate/ImageAnnotate";
import { uuid } from "@utils/uuid";
import { useDispatch } from "react-redux";
import useReview from "../../ReviewPageContext";
import useReviewEditor from "../workspace/ReviewEditorContext";
import { notificationActions } from "@core/redux/notification";

const ImageAnnotationEditor = ({ editor }) => {
  const dispatch = useDispatch();
  const {
    loading,
    error,
    editorData,
    voteUpLabeledItem,
    voteDownLabeledItem,
    selectLabeledItemId,
    selectedLabeledItemId,
  } = useReviewEditor();

  const { setDrawerVisible, nextQueueItem, backQueueItem, memberId } =
    useReview();

  const handleBack = useCallback(() => {
    history.back();
  }, [history]);

  const handleQueue = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  const handleSubmit = useCallback(
    (draftedItem) => {
      for (const li of draftedItem.labeledItems) {
        const myVote = li.myVote || li?.vote?.find((vot) => vot.member_id === memberId);
        if (!myVote) {
          return dispatch(
            notificationActions.addNotification({
              type: "error",
              message: "Missing review",
              description: "Please review all the labels",
            })
          );
        }
      }
      nextQueueItem();
    },
    [dispatch, nextQueueItem, memberId]
  );

  const handleSkip = useCallback(() => {
    backQueueItem();
  }, [dispatch, backQueueItem]);

  const handleVoteUpLabeledItem = useCallback(
    (item) => {
      return voteUpLabeledItem({ labeledItemId: item.id, memberId });
    },
    [memberId]
  );

  const handleVoteDownLabeledItem = useCallback(
    (item) => {
      return voteDownLabeledItem({ labeledItemId: item.id, memberId });
    },
    [memberId]
  );

  const handleSelectLabeledItem = useCallback((id) => {
    selectLabeledItemId(id);
  }, []);

  return (
    <>
      <ImageAnnotate
        mode="review"
        data={editorData}
        config={editor}
        loading={loading}
        error={error}
        onBack={handleBack}
        onNext={nextQueueItem}
        onPrev={backQueueItem}
        onQueue={handleQueue}
        onVoteUpLabeledItem={handleVoteUpLabeledItem}
        onVoteDownLabeledItem={handleVoteDownLabeledItem}
        onSubmitWorkItem={handleSubmit}
        onSkipWorkItem={handleSkip}
        onSelectLabeledItem={handleSelectLabeledItem}
        defaultLabeledItemId={selectedLabeledItemId}
      />
    </>
  );
};

export default ImageAnnotationEditor;
