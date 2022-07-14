import axiosAPI, { setNewHeaders } from "./axiosApi";
import * as yup from 'yup';

const editorSchema = yup.object().shape({
  project_id: yup.number(),
  type: yup.string().oneOf(['image', 'audio']),
  tools: yup.array().of(
    yup.object().shape({
      labels: yup.array().of(
        yup.object().shape({
          name: yup.string(),
          code: yup.string(),
          color: yup.string(),
        }),
      ),
      controls: yup.array().of(
        yup.object().shape({
          name: yup.string(),
          code: yup.string(),
          type: yup.string(),
        })
      )
    })
  )
});

export async function createEditor(data) {
  editorSchema.validateSync(data);

  const response = await axiosAPI.post(`/editor/create/`, data);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}


export async function fetchEditor({ projectId }) {
  yup.number().integer().positive().validateSync(projectId);
  const response = await axiosAPI.get(`/projects/${projectId}/editor/`);
  if (typeof response.data !== "object") {
    throw new Error("expected object value but got string");
  }
  return response;
}

export async function updateEditor({ editor, projectId }) {
  editorSchema.validateSync(editor);

  const response = await axiosAPI.post(`/editor/update/${projectId}/`, editor);
  return response;
}