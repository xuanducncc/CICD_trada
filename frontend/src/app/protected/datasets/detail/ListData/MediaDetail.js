import useMediaFile from "@core/media/hooks/useMediaFile";
import React from "react";

const MediaDetail = ({ id }) => {
  const { url } = useMediaFile({ id });
  return (
    <>
      <img src={url} style={{ maxHeight: "400px", maxWidth: "400px" }} />
    </>
  );
};

export default MediaDetail;
