import React from "react";
import { ReviewProvider } from "./ReviewPageContext";
import ReviewPage from "./ReviewPage";

const ReviewPageWithContext = () => {
  return (
    <ReviewProvider>
      <ReviewPage />
    </ReviewProvider>
  );
};

export default ReviewPageWithContext;
