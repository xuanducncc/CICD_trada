import axiosAPI from "./axiosApi";
import * as yup from 'yup';

export async function getUserList() {
  const response = await axiosAPI.get("users/list/");
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function getUserDetail(id) {
  yup.number().integer().validate(id);
  const response = await axiosAPI.get(`users/${id}/info/`);
  return response;
}

export async function getUserCurrent() {
  const response = await axiosAPI.get(`users/current/`);
  return response;
}

export async function getUserPerformance(id) {
  const response = await axiosAPI.get(`users/${id}/performance/`);
  return response;
}