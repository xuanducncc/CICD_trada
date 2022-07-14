import React from "react";
import PageLayout from "../../../../../../components/PageLayout/PageLayout";
import AvailableData from "./AvailableData";
import { withChooseDataContext } from "./ChooseDataContext";
import AddData from "./AddData";
import AttachedData from "./AttachedData";

const ChooseData = () => {
  return (
    <PageLayout style={{ margin: "0px 30px 20px 20px" }}>
      <PageLayout.Section>
        <AddData />
      </PageLayout.Section>
      <PageLayout.Section title="Attached">
        <AttachedData />
      </PageLayout.Section>
      <PageLayout.Section title="Available">
        <AvailableData />
      </PageLayout.Section>
    </PageLayout>
  );
};

export default withChooseDataContext(ChooseData);
