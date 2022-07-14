import React, { useEffect, useState } from "react";
import * as mediaApi from "@core/api/mediaApi";
import useAsyncEffect from "use-async-effect";

export default function useMediaFile({ id }) {
  const [url, setUrl] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  useAsyncEffect(async () => {
    if (!id) {
      return;
    }
    try {
      setLoading(true);
      const url = await mediaApi.getMediaUrl(id);
      setUrl(url);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    url,
    loading,
    error,
  };
}
