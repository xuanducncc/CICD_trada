import axiosAPI, { setNewHeaders } from "./axiosApi";
import * as yup from "yup";

export const getMediaUrl = async (id) => {
  const response = await axiosAPI.get(`/dataset/file/${id}/`, {
    responseType: "blob",
  });
  const blob = response.data;
  const url = URL.createObjectURL(blob);
  return url;
};
