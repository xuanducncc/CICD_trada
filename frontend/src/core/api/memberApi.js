import axiosAPI from "./axiosApi";
import * as yup from 'yup';

export async function getMemberLists() {
  const response = await axiosAPI.get("member/list/");
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function getMembersProject(id) {
  const response = await axiosAPI.get(`member/project/${id}`);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function adminInviteMember(payload) {
  const response = await axiosAPI.post("member/admininvite/", payload);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function removeMember(id) {
  yup.number().integer().validate(id);
  const response = await axiosAPI.delete(`member/delete/${id}/`);
  return response;
}

export async function memberJoinProject(payload) {
  const response = await axiosAPI.post('member/memberjoin/', payload);
  return response;
}

export async function memberJoinRequest(payload) {
  const response = await axiosAPI.post(`member/joinrequest/`, payload);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function adminAcceptJoinRequest(payload) {
  const response = await axiosAPI.post('member/adminaccept/', payload);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function changeRoleMember(payload) {
  const response = await axiosAPI.post(`/member/changerole/`, payload);
  return response;
}

export async function updateMemberActivation({ memberId, active }) {
  const response = await axiosAPI.post(`/member/activation/`, { member_id: memberId, is_active: active });
  return response;
}
