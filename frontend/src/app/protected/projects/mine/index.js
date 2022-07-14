import React from "react";
import MyProjectListPage from "./MyProjectListPage";
import { MyProjectsListProvider } from "./MyProjectsListContext";

const MyProjectPageWithContext = () => {
  return (
    <MyProjectsListProvider>
      <MyProjectListPage />
    </MyProjectsListProvider>
  );
};

export default MyProjectPageWithContext;
