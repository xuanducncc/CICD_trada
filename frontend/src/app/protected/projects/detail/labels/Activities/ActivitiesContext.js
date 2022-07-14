import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import useProjectQueuesRequester from "@core/hooks/useProjectQueuesRequester";
import useProjectDetail from "../../ProjectDetailContext";
import useProjectActivitiesRequester from "@core/hooks/useProjectActivitiesRequester";
import { useHistory } from "react-router";
import { useLocation } from "react-use";

const ProjectDetailActivitiesContext = createContext({
  currentPage: null,
  fetchActivities: null,
  totalPages: null,
  totalItems: null,
  activities: null,
  loading: null,
  error: null,
});

export const ProjectDetailActivitiesProvider = React.memo(
  ({ children, page }) => {
    const { projectId, memberId, isAdminOrProjectAdmin } = useProjectDetail();
    const history = useHistory();
    const { pathname } = useLocation();
    const {
      fetchActivities,
      currentPage,
      totalPages,
      totalItems,
      activities,
      loading,
      error,
    } = useProjectActivitiesRequester({
      memberId: isAdminOrProjectAdmin ? null : memberId,
      projectId,
    });

    useEffect(() => {
      fetchActivities({ page });
    }, []);

    useEffect(() => {
      const [path] = pathname.split("?");
      const pageSlug = currentPage ? `page=${currentPage}` : "";
      const searchParams = [pageSlug].filter((x) => x).join("&");
      const searchUrl = searchParams ? `?${searchParams}` : "";
      history.replace(`${path}${searchUrl}`);
    }, [history, pathname, currentPage]);

    const contextValue = useMemo(
      () => ({
        fetchActivities,
        currentPage,
        totalPages,
        totalItems,
        activities,
        loading,
        error,
      }),
      [
        fetchActivities,
        currentPage,
        totalPages,
        totalItems,
        activities,
        loading,
        error,
      ]
    );

    return (
      <ProjectDetailActivitiesContext.Provider value={contextValue}>
        {children}
      </ProjectDetailActivitiesContext.Provider>
    );
  }
);

export function withProjectDetailActivitiesContext(Component) {
  return function WrapperComponent(props) {
    return (
      <ProjectDetailActivitiesProvider>
        <Component {...props} />
      </ProjectDetailActivitiesProvider>
    );
  };
}

export const useProjectDetailActivities = () =>
  useContext(ProjectDetailActivitiesContext);

export default useProjectDetailActivities;
