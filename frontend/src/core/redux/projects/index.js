import { combineReducers } from "redux";

import projectList, {
  projectListAdapter,
  fetchProjects,
  updateProjectsOptions,
  syncProjectsOptions,
} from "./projectList";
import projectDetail, {
  fetchProject,
  fetchListInstruction,
  fetchItemInstruction,
  updateProjectInstruction,
  onHandleStatusInvite,
  onHandleJoinRequestProject,
  onHandleAcceptJoinRequestProject,
  onChangeRoleMember,
  exportLabelItem,
  projectSlice,
} from "./projectDetail";
import projectEditor, {
  createProjectEditor,
  fetchEditor,
  requestEditorProjectId,
  projectEditorSlice,
  updateProjectEditor,
} from "./projectEditor";
import projectSettings, {
  createProjectSettings,
  projectSettingsSlice,
} from "./projectSettings";
import projectMembers, {
  fetchMembersProject,
  removeMember,
  addMember,
  updateMemberActivation,
  projectMemberSlice,
  projectMembersAdapter,
} from "./projectMembers";
import projectData, {
  fetchProjectOverview,
  fetchLogLabeledItem,
  fetchMemberPerformance,
  fetchProjectPerformance,
  fetchProjectLabeledHistory,
  projectDataSlice,
} from "./projectData";
import projectMutation, {
  createProject,
  attachProject,
  detachProject,
  deleteProject,
  addNewMember,
  removeNewMember,
  projectMutationSlice,
  requestSetCurrentStep,
  createProjectFinish,
  createNewProjectInstruction,
} from "./projectMutation";

import projectExport, { exportProject } from "./projectExport";

import projectBatch, {
  fetchProjectBatch,
  projectBatchAdapter,
} from "./projectBatch";

import projectQueues, {
  fetchProjectQueue,
  projectQueueAdapter,
  projectQueueSlice,
} from "./projectQueue";
import projectActivities, {
  fetchLogActivities,
  projectActivitiesAdapter,
} from "./projectActivities";
import { createSelector } from "reselect";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Legalize from "legalize";
import { assert } from "@utils/assert";
import { PROJECT_MEMBER_ROLES, PROJECT_MEMBER_STATUS } from "@utils/const";

export const requestProjectId = createAsyncThunk(
  "projects/requestProjectId",
  async (payload, { getState, dispatch, rejectWithValue }) => {
    assert(
      Legalize.object().keys({
        id: Legalize.string().numeric().required(),
        useCache: Legalize.bool().optional(),
      })
    )(payload);

    const { id, useCache } = payload;
    const result = await dispatch(fetchProject({ id }));
    if (result.error) {
      return rejectWithValue(result.payload);
    }
    return result.payload;
  }
);

export default combineReducers({
  projectList,
  projectDetail,
  projectEditor,
  projectMembers,
  projectMutation,
  projectSettings,
  projectQueues,
  projectData,
  projectActivities,
  projectExport,
  projectBatch,
});

const selectSelf = (state) => state.projects;

const selectProjectList = createSelector(
  selectSelf,
  (state) => state.projectList
);

const projectListSelectors = projectListAdapter.getSelectors(selectProjectList);

const selectProjectsJoined = createSelector(
  projectListSelectors.selectEntities,
  projectListSelectors.selectIds,
  (entities, ids) =>
    ids.filter(
      (id) =>
        entities[id].member &&
        entities[id].member.status == PROJECT_MEMBER_STATUS.JOINED
    )
);

const selectProjectsInvited = createSelector(
  projectListSelectors.selectEntities,
  projectListSelectors.selectIds,
  (entities, ids) =>
    ids.filter(
      (id) =>
        entities[id].member &&
        entities[id].member.status == PROJECT_MEMBER_STATUS.PENDING
    )
);

const selectProjectsAvailable = createSelector(
  projectListSelectors.selectEntities,
  projectListSelectors.selectIds,
  (entities, ids) => ids.filter((id) => !entities[id].member)
);

const selectProjectsError = createSelector(
  selectProjectList,
  (state) => state.error
);

const selectProjectsLoading = createSelector(
  selectProjectList,
  (state) => state.loading
);

const selectProjectListOption = createSelector(
  selectProjectList,
  (state) => state.options
);

export const projectsActions = {
  fetchProjects,
  fetchProject,
  fetchListInstruction,
  fetchItemInstruction,
  updateProjectInstruction,
  requestProjectId,
  createProject,
  createProjectFinish,
  createProjectEditor,
  attachProject,
  detachProject,
  deleteProject,
  createProjectSettings,
  updateProjectEditor,
  addMember,
  removeNewMember,
  removeMember,
  addNewMember,
  createNewProjectInstruction,
  fetchMembersProject,
  onHandleStatusInvite,
  onHandleJoinRequestProject,
  onHandleAcceptJoinRequestProject,
  onChangeRoleMember,
  exportLabelItem,
  fetchProjectQueue,
  requestSetCurrentMutationStep: requestSetCurrentStep,
  setProjectMutationInfo: projectMutationSlice.actions.setProjectInfo,
  setProjectMutationEditor: projectMutationSlice.actions.setProjectEditor,
  setProjectMutationSettings: projectMutationSlice.actions.setProjectSettings,
  setProjectMutationPreview: projectMutationSlice.actions.setPreview,
  resetAllStatus: projectMutationSlice.actions.resetAllStatus,
  fetchProjectEditor: fetchEditor,
  requestEditorProjectId,
  setProjectMutationMembers: projectMutationSlice.actions.setProjectMembers,
  setUpdateProjectSettings:
    projectSettingsSlice.actions.setUpdateProjectSetting,
  setUpdateProjectEditor: projectEditorSlice.actions.setProjectEditor,
  updateProjectsOptions,
  syncProjectsOptions,
  fetchProjectOverview,
  fetchLogLabeledItem,
  fetchLogActivities,
  exportProject,
  fetchProjectBatch,
  selectQueueItem: projectQueueSlice.actions.selectQueueItem,
  setProjectDetailPreview: projectSlice.actions.setPreviewSetting,
  resetProjectDataListStat: projectDataSlice.actions.resetListStat,
  fetchMemberPerformance,
  fetchProjectPerformance,
  fetchProjectLabeledHistory,
  updateMemberActivation,
};

const selectProjectDetail = createSelector(
  selectSelf,
  (state) => state.projectDetail
);

const selectProjectDetailProject = createSelector(
  selectProjectDetail,
  (state) => state.project
);

const selectProjectDetailMembers = createSelector(
  selectProjectDetailProject,
  (state) => state?.members
);

const selectProjectDetailInstructionList = createSelector(
  selectProjectDetail,
  (state) => state?.instruction_list
);

const selectProjectDetailInstructionItem = createSelector(
  selectProjectDetail,
  (state) => state?.instruction_item
);

const selectProjectDetailMember = createSelector(
  selectProjectDetailProject,
  (state) => state?.member
);

const selectProjectDetailError = createSelector(
  selectProjectDetail,
  (state) => state.error
);
const selectProjectDetailLoading = createSelector(
  selectProjectDetail,
  (state) => state.loading
);

const selectProjectDetailRequestedId = createSelector(
  selectProjectDetail,
  (state) => state.requestedId
);

const selectProjectDetailLabelAvailable = createSelector(
  selectProjectDetailMember,
  (state) => state?.label_available
);

const selectProjectDetailValidateAvailable = createSelector(
  selectProjectDetailMember,
  (state) => state?.validate_available
);

const selectProjectDetailReviewAvailable = createSelector(
  selectProjectDetailMember,
  (state) => state?.review_available
);

const selectProjectDetailQueueReviewId = createSelector(
  selectProjectDetailMember,
  (state) => state?.queue_review_id
);

const selectProjectDetailQueueLabelId = createSelector(
  selectProjectDetailMember,
  (state) => state?.queue_label_id
);

const selectProjectDetailPreview = createSelector(
  selectProjectDetail,
  (state) => state.preview
);

const selectProjectMutation = createSelector(
  selectSelf,
  (state) => state.projectMutation
);

const selectProjectEditor = createSelector(
  selectSelf,
  (state) => state.projectEditor
);

const selectProjectEditorRequestedId = createSelector(
  selectProjectEditor,
  (state) => state.requestedId
);

const selectProjectEditorDetail = createSelector(
  selectProjectEditor,
  (state) => state.editor
);

const selectProjectEditorLoading = createSelector(
  selectProjectEditor,
  (state) => state.loading
);

const selectProjectEditorError = createSelector(
  selectProjectEditor,
  (state) => state.error
);

const selectProjectSettings = createSelector(
  selectSelf,
  (state) => state.projectSettings?.settings
);

const selectMutationMembers = createSelector(
  selectProjectMutation,
  (state) => state.member.memberList
);

const selectProjectMembers = createSelector(
  selectSelf,
  (state) => state.projectMembers
);

const projectMemberSelectors =
  projectMembersAdapter.getSelectors(selectProjectMembers);

const selectProjectMembersList = projectMemberSelectors.selectAll;

const selectProjectJoinMemberList = createSelector(
  selectProjectMembersList,
  (members) =>
    members.filter((member) => member.status === "JOINED" && member.is_active)
);

const selectProjectJoinLabelersList = createSelector(
  selectProjectJoinMemberList,
  (members) =>
    members.filter((member) =>
      member?.role?.some((rol) => rol.name === PROJECT_MEMBER_ROLES.LABELER)
    )
);

const selectProjectMemberLoading = createSelector(
  selectProjectMembers,
  (state) => state.loading
);

const selectProjectMemberError = createSelector(
  selectProjectMembers,
  (state) => state.error
);

const selectProjectMemberRequestedId = createSelector(
  selectProjectMembers,
  (state) => state.requestedId
);

const selectProjectQueue = createSelector(
  selectSelf,
  (state) => state.projectQueues
);

const selectProjectQueueSelectors =
  projectQueueAdapter.getSelectors(selectProjectQueue);

const selectProjectQueueList = selectProjectQueueSelectors.selectAll;

const selectProjectQueuePage = createSelector(
  selectProjectQueue,
  (state) => state.currentPage
);

const selectProjectQueueTotalItems = createSelector(
  selectProjectQueue,
  (state) => state.totalItems
);

const selectProjectQueueTotalPages = createSelector(
  selectProjectQueue,
  (state) => state.totalPages
);

const selectProjectQueueStatus = createSelector(
  selectProjectQueue,
  (state) => state.status
);

const selectProjectQueueLoading = createSelector(
  selectProjectQueue,
  (state) => state.loading
);

const selectProjectQueueSelectedId = createSelector(
  selectProjectQueue,
  (state) => state.selectedId
);

const selectProjectQueueError = createSelector(
  selectProjectQueue,
  (state) => state.error
);

const selectProjectData = createSelector(
  selectSelf,
  (state) => state.projectData
);

const selectProjectDataOverview = createSelector(
  selectProjectData,
  (state) => state.overview
);

const selectProjectDataStats = (id) =>
  createSelector(selectProjectData, (state) =>
    !state?.memberStats[String(id)]
      ? state.memberStats.all
      : state.memberStats[String(id)]
  );

const selectProjectDataStatList = createSelector(
  selectProjectData,
  (state) => state.listStats
);

const selectProjectDataMemberPerformance = createSelector(
  selectProjectData,
  (state) => state.memberPerformance
);

const selectProjectDataProjectPerformance = createSelector(
  selectProjectData,
  (state) => state.projectPerformance
);

const selectProjectDataProjectLabeledHistory = createSelector(
  selectProjectData,
  (state) => state.history
);

const selectProjectDataMemberStatsById = (id) =>
  createSelector(selectProjectData, (state) => state.memberStats[String(id)]);

const selectProjectDataError = createSelector(
  selectProjectData,
  (state) => state.error
);

const selectProjectDataLoading = createSelector(
  selectProjectData,
  (state) => state.loading
);

const selectProjectDataRequestedId = createSelector(
  selectProjectData,
  (state) => state.projectData
);

const selectProjectMutationLoading = createSelector(
  selectProjectMutation,
  (state) => state.loading
);

const selectProjectMutationPreview = createSelector(
  selectProjectMutation,
  (state) => state.preview
);

const selectProjectMutationError = createSelector(
  selectProjectMutation,
  (state) => state.error
);

const selectProjectActivities = createSelector(
  selectSelf,
  (state) => state.projectActivities
);

const projectActivitiesSelectors = projectActivitiesAdapter.getSelectors(
  selectProjectActivities
);

const selectProjectActivitiesList = projectActivitiesSelectors.selectAll;

const selectProjectActivitiesIds = projectActivitiesSelectors.selectIds;

const selectProjectActivitiesEntities =
  projectActivitiesSelectors.selectEntities;

const selectProjectActivitiesListByMemberId = (memberId) =>
  createSelector(selectProjectActivitiesList, (activities) =>
    !memberId
      ? activities
      : activities.filter((activity) => activity.member_id === memberId)
  );

const selectProjectActivitiesPage = createSelector(
  selectProjectActivities,
  (state) => state.currentPage
);

const selectProjectActivitiesTotalItems = createSelector(
  selectProjectActivities,
  (state) => state.totalItems
);

const selectProjectActivitiesTotalPages = createSelector(
  selectProjectActivities,
  (state) => state.totalPages
);

const selectProjectActivitiesLoading = createSelector(
  selectProjectActivities,
  (state) => state.loading
);

const selectProjectActivitiesError = createSelector(
  selectProjectActivities,
  (state) => state.error
);

const selectProjectExportStatus = createSelector(
  selectSelf,
  (state) => state.projectExport
);

const selectProjectExportLoading = createSelector(
  selectProjectExportStatus,
  (state) => state.loading
);

const selectProjectActivitiesRequestedById = (id) =>
  createSelector(selectProjectActivities, (state) => state.requestedIds[id]);

const selectProjectBatches = createSelector(
  selectSelf,
  (state) => state.projectBatch
);

const selectProjectBatchesSelectors =
  projectBatchAdapter.getSelectors(selectProjectBatches);

const selectProjectBatchesList = selectProjectBatchesSelectors.selectAll;

const selectProjectBatchesError = createSelector(
  selectProjectBatches,
  (state) => state.error
);

const selectProjectBatchesLoading = createSelector(
  selectProjectBatches,
  (state) => state.loading
);

const selectProjectBatchesPage = createSelector(
  selectProjectBatches,
  (state) => state.currentPage
);

const selectProjectBatchesTotalItems = createSelector(
  selectProjectBatches,
  (state) => state.totalItems
);

const selectProjectBatchesTotalPages = createSelector(
  selectProjectBatches,
  (state) => state.totalPages
);

const selectProjectBatchStatus = createSelector(
  selectProjectBatches,
  (state) => state.status
);

export const projectsSelectors = {
  selectAll: projectListSelectors.selectAll,
  selectTotal: projectListSelectors.selectTotal,
  selectProjectsJoined,
  selectProjectsInvited,
  selectProjectsAvailable,
  selectProjectsError,
  selectProjectsLoading,
  selectProjectDetailProject,
  selectProjectDetailMembers,
  selectProjectDetailMember,
  selectProjectDetailInstructionList,
  selectProjectDetailInstructionItem,
  selectProjectDetailError,
  selectProjectDetailLoading,
  selectProjectDetailRequestedId,
  selectProjectDetailLabelAvailable,
  selectProjectDetailReviewAvailable,
  selectProjectDetailQueueReviewId,
  selectProjectDetailQueueLabelId,
  selectProjectDetailPreview,
  selectProjectDataOverview,
  selectProjectDataStats,
  selectProjectDataStatList,
  selectProjectDataMemberStatsById,
  selectProjectDataError,
  selectProjectDataLoading,
  selectProjectDataRequestedId,
  selectProjectMutation,
  selectProjectEditorDetail,
  selectProjectEditorLoading,
  selectProjectEditorError,
  selectProjectEditorRequestedId,
  selectMutationMembers,
  selectProjectListOption,
  selectProjectMembersList,
  selectProjectJoinMemberList,
  selectProjectMemberRequestedId,
  selectProjectMemberLoading,
  selectProjectMemberError,
  selectProjectQueueList,
  selectProjectQueueLoading,
  selectProjectQueueSelectedId,
  selectProjectQueueError,
  selectProjectMutationLoading,
  selectProjectMutationError,
  selectProjectActivitiesList,
  selectProjectActivitiesLoading,
  selectProjectActivitiesListByMemberId,
  selectProjectActivitiesRequestedById,
  selectProjectActivitiesError,
  selectProjectSettings,
  selectProjectExportLoading,
  selectProjectMutationPreview,
  selectProjectBatchesList,
  selectProjectBatchesError,
  selectProjectBatchesLoading,
  selectProjectJoinLabelersList,
  selectProjectDataMemberPerformance,
  selectProjectDataProjectPerformance,
  selectProjectDataProjectLabeledHistory,
  selectProjectQueuePage,
  selectProjectQueueTotalPages,
  selectProjectQueueTotalItems,
  selectProjectQueueStatus,
  selectProjectDetailValidateAvailable,
  selectProjectActivitiesPage,
  selectProjectActivitiesTotalItems,
  selectProjectActivitiesTotalPages,
  selectProjectBatchesPage,
  selectProjectBatchesTotalItems,
  selectProjectBatchesTotalPages,
  selectProjectBatchStatus,
};

export const projectsMiddleWares = [];
