import React, { useCallback, useMemo } from "react";
import MoreOutlined from "@ant-design/icons/MoreOutlined";
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import { styled } from "@material-ui/styles";
import Button from "antd/lib/button";
import Menu from "antd/lib/menu";
import Dropdown from "antd/lib/dropdown";
import LikeOutlined from "@ant-design/icons/LikeOutlined";
import DislikeOutlined from "@ant-design/icons/DislikeOutlined";
import { Badge } from 'antd';
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import DetectionToolIcon from "../DetectionToolIcon/DetectionToolIcon";

const ObjectBarItemWrapper = styled("div")({
  display: "flex",
  flex: "1",
  justifyContent: "space-between",
  cursor: "pointer",
  backgroundColor: ({ active }) => (active ? "#40a9ffcc" : "transparent"),
});

const ObjectBarItemMainWrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  flexGrow: "1",
  justifyContent: "space-between",
  alignItems: "center",
});

const ObjectBarItemReviewWrapper = styled("div")({
  padding: "10px",
});

const ObjectBarItem = ({ object, active }) => {
  const {
    updateShape,
    deleteShape,
    voteUpLabeledItem,
    voteDownLabeledItem,
    mode,
  } = useImageAnnotate();
  const { labelName, state, color, index } = object;
  const name = `${labelName} ${index}`;
  const { visible } = state;

  const handleHideClick = useCallback(
    (e) => {
      e.preventDefault();
      updateShape({
        ...object,
        state: {
          ...object.state,
          visible: false,
        },
        updated: {
          state: {
            visible: true,
          },
        },
      });
    },
    [updateShape, object]
  );

  const handleShowClick = useCallback(
    (e) => {
      e.preventDefault();
      updateShape({
        ...object,
        state: {
          ...object.state,
          visible: true,
        },
        updated: {
          state: {
            visible: true,
          },
        },
      });
    },
    [updateShape, object]
  );

  const handleDeleteItem = useCallback(() => {
    deleteShape(object.clientId);
  }, [deleteShape, object]);

  const myVoteScore = useMemo(() => {
    return object.myVote ? object.myVote.score : 0;
  }, [object]);

  const countVoteUp = useMemo(() => {
    return object?.vote?.filter((item) => item.score === 1)?.length || 0
  }, [object])

  const countVoteDown = useMemo(() => {
    return object?.vote?.filter((item) => item.score === -1)?.length || 0
  }, [object])

  const menu = (
    <Menu>
      <Menu.Item>Copy</Menu.Item>
      <Menu.Item>Paste</Menu.Item>
      <Menu.Item>Duplicate</Menu.Item>
      <Menu.Item>Change Class</Menu.Item>
      <Menu.Item>Bring to front</Menu.Item>
      <Menu.Item>Send to back</Menu.Item>
      <Menu.Item danger onClick={handleDeleteItem}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <ObjectBarItemWrapper active={active}>
      <ObjectBarItemMainWrapper>
        <DetectionToolIcon color={color} type={object.controlType} />
        <div style={{ marginLeft: 55 }}>{name}</div>
        <div>
          {visible && (
            <Button
              onClick={handleHideClick}
              type="text"
              icon={<EyeOutlined />}
            ></Button>
          )}
          {!visible && (
            <Button
              onClick={handleShowClick}
              type="text"
              icon={<EyeInvisibleOutlined />}
            ></Button>
          )}
          {mode === "annotate" && (
            <Dropdown trigger="click" overlay={menu}>
              <Button type="text" icon={<MoreOutlined />}></Button>
            </Dropdown>
          )}
        </div>
      </ObjectBarItemMainWrapper>
      {mode === "review" && (
        <ObjectBarItemReviewWrapper>
          <Button.Group>
            <Button
              type={myVoteScore === -1 ? 'danger' : 'default'}
              onClick={() => active && voteDownLabeledItem(object)}
              style={{ pointerEvents: active ? 'auto' : 'none', opacity: active ? '1' : '0.8' }}
              icon={<DislikeOutlined />}
            ></Button>
            <Button
              type={myVoteScore === 1 ? 'primary' : 'default'}
              onClick={() => active && voteUpLabeledItem(object)}
              style={{ pointerEvents: active ? 'auto' : 'none', opacity: active ? '1' : '0.8' }}
              icon={<LikeOutlined />}
            ></Button>
          </Button.Group>
        </ObjectBarItemReviewWrapper>
      )}
      {mode === "verify" && (
        <ObjectBarItemReviewWrapper>
          <Button.Group>
            <Badge count={countVoteDown} showZero style={{ zIndex: "999" }}>
              <Button
                type={myVoteScore === -1 ? 'danger' : 'default'}
                style={{ pointerEvents: active ? 'auto' : 'none', opacity: active ? '1' : '0.8' }}
                icon={<DislikeOutlined />}
              ></Button>
            </Badge>
            <Badge count={countVoteUp} showZero style={{ zIndex: "999" }}>
              <Button
                type={myVoteScore === 1 ? 'primary' : 'default'}
                style={{ pointerEvents: active ? 'auto' : 'none', opacity: active ? '1' : '0.8' }}
                icon={<LikeOutlined />}
              ></Button>
            </Badge>
          </Button.Group>
        </ObjectBarItemReviewWrapper>
      )}
    </ObjectBarItemWrapper>
  );
};

export default ObjectBarItem;
