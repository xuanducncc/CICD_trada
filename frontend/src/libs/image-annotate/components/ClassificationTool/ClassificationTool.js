import { styled } from "@material-ui/styles";
import Select from "antd/lib/select";
import { CLASSIFICATION_CONTROLS } from "@utils/const";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import Radio from "antd/lib/radio";
import Button from "antd/lib/button";
import Badge from "antd/lib/badge";
import LikeOutlined from "@ant-design/icons/LikeOutlined";
import DislikeOutlined from "@ant-design/icons/DislikeOutlined";

import {
  ClassificationToolControlProvider,
  ClassificationToolControlContext,
} from "./ClassificationToolControlContext";
import ClassificationToolControlRadio from "./ClassificationToolControlRadio";
import ClassificationToolControlDropdown from "./ClassificationToolControlDropdown";
import ClassificationToolControlCheckList from "./ClassificationToolControlCheckList";
import ClassificationToolControlCheckListText from "./ClassificationToolControlCheckListText";

const ClassificationToolWrapper = styled("div")({
  width: "100%",
  display: "flex",
  border: ({ active }) => (active ? "1px dashed gray" : "none"),
});

const ClassificationMainWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  flexGrow: "1",
  marginRight: "10px",
});

const ClassificationDescWrapper = styled("div")({});

const ClassificationControlWrapper = styled("div")({});

const ClassificationReviewWrapper = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginRight: "10px",
});

const ClassificationTool = ({ tool, mode }) => {
  return (
    <ClassificationToolControlProvider tool={tool}>
      <ClassificationToolControlContext.Consumer>
        {({
          description,
          isActive,
          disabled,
          control,
          countVoteDown,
          countVoteUp,
          myVoteScore,
          handleVoteDownClass,
          handleVoteUpClass,
        }) => (
          <ClassificationToolWrapper active={isActive && disabled}>
            <ClassificationMainWrapper>
              <ClassificationDescWrapper>
                {description}
              </ClassificationDescWrapper>
              <ClassificationControlWrapper>
                {control.type === CLASSIFICATION_CONTROLS.DROPDOWN && (
                  <ClassificationToolControlDropdown />
                )}
                {control.type === CLASSIFICATION_CONTROLS.RADIO && (
                  <ClassificationToolControlRadio />
                )}
                {control.type === CLASSIFICATION_CONTROLS.CHECKLIST && (
                  <ClassificationToolControlCheckList />
                )}
                {control.type === CLASSIFICATION_CONTROLS.TEXT && (
                  <ClassificationToolControlCheckListText />
                )}
              </ClassificationControlWrapper>
            </ClassificationMainWrapper>
            {(mode === "review" || mode === "preview") && (
              <ClassificationReviewWrapper>
                <Button.Group>
                  <Button
                    type={myVoteScore === -1 ? "danger" : "default"}
                    onClick={() => isActive && handleVoteDownClass()}
                    style={{
                      pointerEvents: isActive ? "auto" : "none",
                      opacity: isActive ? "1" : "0.8",
                    }}
                    icon={<DislikeOutlined />}
                  ></Button>
                  <Button
                    type={myVoteScore === 1 ? "primary" : "default"}
                    onClick={() => isActive && handleVoteUpClass()}
                    style={{
                      pointerEvents: isActive ? "auto" : "none",
                      opacity: isActive ? "1" : "0.8",
                    }}
                    icon={<LikeOutlined />}
                  ></Button>
                </Button.Group>
              </ClassificationReviewWrapper>
            )}
            {mode === "verify" && (
              <ClassificationReviewWrapper>
                <Button.Group>
                  <Badge
                    count={countVoteDown}
                    showZero
                    style={{ zIndex: "999" }}
                  >
                    <Button
                      type={myVoteScore === -1 ? "danger" : "default"}
                      style={{
                        pointerEvents: isActive ? "auto" : "none",
                        opacity: isActive ? "1" : "0.8",
                      }}
                      icon={<DislikeOutlined />}
                    ></Button>
                  </Badge>
                  <Badge count={countVoteUp} showZero>
                    <Button
                      type={myVoteScore === 1 ? "primary" : "default"}
                      style={{
                        pointerEvents: isActive ? "auto" : "none",
                        opacity: isActive ? "1" : "0.8",
                      }}
                      icon={<LikeOutlined />}
                    ></Button>
                  </Badge>
                </Button.Group>
              </ClassificationReviewWrapper>
            )}
          </ClassificationToolWrapper>
        )}
      </ClassificationToolControlContext.Consumer>
    </ClassificationToolControlProvider>
  );
};
export default ClassificationTool;
