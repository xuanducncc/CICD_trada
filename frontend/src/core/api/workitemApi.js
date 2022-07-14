import { assert } from "@utils/assert";
import { WORK_ITEM_STATUS } from "@utils/const";
import legalize from "legalize/src/legalize";
import axiosAPI from "./axiosApi";

export async function createWorkItem(id) {
  const response = await axiosAPI.post(`/workitem/dividetask/${id}`);
  // if (typeof response.data !== "object") {
  //   throw new Error("expected object value but got string");
  // }
  return response;
}

export async function getMyWorkItems({
  projectId,
  memberId,
  queueId,
  status,
  role,
  page,
  page_size,
  label,
  id,
}) {
  const response = await axiosAPI.get(`/workitem/queue/`, {
    params: {
      project_id: projectId,
      member: memberId,
      queue_id: queueId,
      labelcode: label || undefined,
      page_size,
      status,
      role,
      page,
      id,
    },
  });
  return response;
}

export async function getWorkItemDetail(id) {
  const response = await axiosAPI.get(`/workitem/${id}/`);
  return response;
}

export async function updateWorkItem(workItem) {
  const id = workItem.id;
  const response = await axiosAPI.post(
    `/workitem/${id}/labeled/update/`,
    workItem
  );
  return response;
}

export async function submitWorkItem(workItem) {
  const id = workItem.id;
  const data = (workItem.labeledItems || []).map(
    ({
      labelCode,
      label_id,
      labelName,
      labelValue,
      tool_id,
      controlType,
      toolType,
      color,
      index,
    }) => ({
      label_id,
      tool_id,
      color,
      index,
      toolType,
      controlType,
      labelCode,
      labelName,
      labelValue,
    })
  );

  const response = await axiosAPI.post(`/workitem/${id}/submit/`, data);
  return response;
}

export async function skipWorkItem(workItem) {
  const id = workItem.id;
  const response = await axiosAPI.post(`/workitem/${id}/skip/`);
  return response;
}

export async function requestQueue(id) {
  const response = await axiosAPI.post(`/member/${id}/requestlabel/`);
  return response;
}

export async function getQueueList({ projectId, memberId, page, status }) {
  const response = await axiosAPI.get(`projects/queuelist/`, {
    params: { member_id: memberId, project_id: projectId, page, status },
  });
  return response;
}

export async function getQueueDetail({ queueId }) {
  const response = await axiosAPI.get(`projects/queuedetail/${queueId}`);
  return response;
}

export async function verifyWorkItem(payload) {
  const response = await axiosAPI.post("/workitem/verify/", payload);
  return response;
}

export async function voteLabeledItem(payload) {
  const response = await axiosAPI.post("/workitem/labelvote/", payload);
  return response;
}

export async function memberGetQueueReview(id) {
  const response = await axiosAPI.post(`/member/${id}/requestreview/`);
  return response;
}
