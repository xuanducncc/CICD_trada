import axiosAPI, { setNewHeaders } from "./axiosApi";
import * as yup from "yup";
import { ACTION_LOG_ACTIONS, ACTION_LOG_OBJECTS } from "@utils/const";

const logSchema = yup.object().shape({
  member_id: yup.number().optional().nullable(),
  user_id: yup.number().optional().nullable(),
  project_id: yup.number().optional().nullable(),
  workitem_id: yup.number().optional().nullable(),
  labeleditem_id: yup.number().optional().nullable(),
  change_message: yup.string().optional(),
  value: yup.object(),
  label_id: yup.string().optional().nullable(),
  tool_id: yup.number().optional().nullable(),
  action: yup.string().oneOf(Object.values(ACTION_LOG_ACTIONS)),
  object: yup.string().oneOf(Object.values(ACTION_LOG_OBJECTS)),
});

export const createActionLog = async (data) => {
  logSchema.validateSync(data);
  const response = await axiosAPI.post(`log/create/`, data);
  return response;
};
