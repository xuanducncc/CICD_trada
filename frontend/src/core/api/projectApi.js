import axiosAPI, { setNewHeaders } from "./axiosApi";
import * as yup from "yup";
import fileDownload from "js-file-download";

export async function getProjects({ listType }) {
  const response = await axiosAPI.get(
    `projects/list/?list_type=${listType}&status=ANNOTATION`
  );
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function getProject(id) {
  yup.number().validateSync(id);
  const response = await axiosAPI.get(`projects/detail/${id}/`);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function createProject(payload) {
  const { name, description } = payload;
  const data = {
    name,
    description,
  };
  const response = await axiosAPI.post(`projects/create/`, data);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function createProjectSettings(settings) {
  const {
    overlap_enable,
    overlap_percent,
    overlap_time,
    review_enable,
    review_percent,
    queue_size,
    review_vote,
    project_id,
  } = settings;

  const data = {
    overlap_enable,
    overlap_percent,
    overlap_time,
    review_enable,
    review_percent,
    queue_size,
    review_vote,
    project_id,
  };
  const response = await axiosAPI.post(`projects/settings/`, data);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function deleteProject({ id }) {
  yup.number().integer().validate(id);
  const response = await axiosAPI.delete(`projects/delete/${id}/`);
  return response;
}

export async function createProjectFinish({ id }) {
  yup.number().integer().validate(id);
  const response = await axiosAPI.post(`projects/finish/${id}/`);
  return response;
}

export async function attachProject(payload) {
  const response = await axiosAPI.post(`projects/attachdataset/`, payload);
  return response;
}

export async function detachProject(payload) {
  const response = await axiosAPI.post(`projects/detachdataset/`, payload);
  return response;
}

export async function getProjectOverview({ projectId, id }) {
  const response = await axiosAPI.get(`projects/${projectId}/overview/`, {
    params: { member_id: id },
  });
  return response;
}

export async function getLogLabeledItem({ projectId, id }) {
  const response = await axiosAPI.get(`log/labeleditem/`, {
    params: { member_id: id, project_id: projectId },
  });
  return response;
}

export async function getProjectPerformance({ projectId }) {
  const response = await axiosAPI.get(`projects/${projectId}/performance/`);
  return response;
}

export async function getMemberPerformance({ memberId }) {
  const response = await axiosAPI.get(`member/${memberId}/performance/`);
  return response;
}

export async function getUserPerformance({ userId }) {
  const response = await axiosAPI.get(`users/${userId}/performance/`);
  return response;
}

export async function getLogWorkItem({ projectId, memberId, page }) {
  const response = await axiosAPI.get(`log/workitem/`, {
    params: {
      project_id: projectId,
      member_id: memberId,
      page_size: "10",
      page,
    },
  });
  return response;
}

export async function getQueueList({ projectId, memberId }) {
  const response = await axiosAPI.get(`projects/${projectId}/queue-list/`, {
    params: { member_id: memberId },
  });
  return response;
}

export async function getQueueDetail({ queueId }) {
  const response = await axiosAPI.get(`projects/queue-detail/${queueId}`);
  return response;
}

export async function exportLabel(projectId) {
  const response = await axiosAPI.post(
    `projects/${projectId}/export/`,
    {},
    {
      responseType: "blob",
    }
  );
  const contentDisposition = response.headers["content-disposition"];
  const fileNameStr = contentDisposition.split("filename=")[1];
  const fileName = JSON.parse(fileNameStr);
  fileDownload(response.data, fileName, "application/zip");
  return response;
}

export async function getProjectLabeledHistory({ projectId }) {
  const response = await axiosAPI.post(
    `projects/${projectId}/labeled/history/`
  );
  return response;
}

export async function fetchListInstruction(id) {
  const response = await axiosAPI.get(`/projects/${id}/instructions/list/`);
  return response;
}

export async function fetchItemInstruction(id) {
  const response = await axiosAPI.get(
    `/projects/instructions/attachment/${id}/`,
    {
      responseType: "blob",
    }
  );
  const blob = response.data;
  const url = URL.createObjectURL(blob);
  return url;
}

export async function fetchInstruction(id) {
  const data = await axiosAPI.get(`/projects/${id}/instructions/list/`);
  if (data.data.length !== 0) {
    const instruction_id = data.data[0].id;
    const response = await axiosAPI.get(
      `/projects/instructions/attachment/${instruction_id}/`,
      {
        responseType: "blob",
      }
    );
    const blob = response.data;
    const url = URL.createObjectURL(blob);
    return url;
  }
  return;
}

export async function createInstruction(payload) {
  const response = await axiosAPI.post(
    `/projects/instructions/create/`,
    payload
  );
  return response;
}
