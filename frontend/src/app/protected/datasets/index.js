import React from "react";
import PageLayout from "../../../components/PageLayout/PageLayout";
import DatasetsComponent from "./list/datasets";
import { DatasetPageProvider } from "./DatasetPageContext";


const DatasetsPage = () => {

    return (
      <DatasetPageProvider>
        <PageLayout>
          <DatasetsComponent/>
        </PageLayout>
        </DatasetPageProvider>
    );
};

export default DatasetsPage;
