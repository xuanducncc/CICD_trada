import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { projectsActions, projectsSelectors } from "@core/redux/projects";
import FuzzySearch from "fuzzy-search";

const ProjectsFilteredListContext = createContext({
  projects: null,
  options: null,
  deleteProject: null,
  searchTerm: null,
  setSearchTerm: null,
});

export const ProjectsFilteredListProvider = ({
  projects: rawProjects,
  children,
  options,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const projects = useMemo(() => {
    const searcher = new FuzzySearch(rawProjects, ["name", "description"], {
      caseSensitive: false,
    });
    const result = searcher.search(searchTerm);
    return result;
  }, [rawProjects, searchTerm]);

  const deleteProject = async (id) => {
    await dispatch(projectsActions.deleteProject({ id }));
    await dispatch(projectsActions.fetchProjects({ listType: "ALL" }));
  };



  const contextValue = useMemo(
    () => ({
      projects,
      options,
      deleteProject,
      searchTerm,
      setSearchTerm,
    }),
    [projects, options, deleteProject, searchTerm, setSearchTerm]
  );

  return (
    <ProjectsFilteredListContext.Provider value={contextValue}>
      {children}
    </ProjectsFilteredListContext.Provider>
  );
};

export const useProjectsFilteredList = () =>
  useContext(ProjectsFilteredListContext);

export default useProjectsFilteredList;
