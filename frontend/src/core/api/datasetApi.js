import axiosAPI from "./axiosApi";
import propTypes from "prop-types";
import { assert } from "@utils/assert";

export async function getDatasets() {
  const response = await axiosAPI.get("dataset/list/");
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function getDatasetMedias({ datasetId, page }) {
  const response = await axiosAPI.get(`dataset/${datasetId}/images/`, {
    params: {
      page,
      pageSize: '10'
    }
  });
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function getDatasetDetail(id) {
  const response = await axiosAPI.get(`dataset/${id}/detail/`);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function createDataset(payload) {
  const response = await axiosAPI.post("dataset/create/", payload);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function uploadDataset(payload) {
  const response = await axiosAPI.post("dataset/upload/", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function uploadDatasetZip(payload) {
  const response = await axiosAPI.post(`dataset/${payload?.id}/uploadzip/`, payload.payload, {
    responseType: "blob",
  });
  return response;
}

export async function deleteDataset(id) {
  // assert(propTypes.number().required())(id);

  const response = await axiosAPI.delete(`dataset/delete/${id}/`);
  return response;
}
