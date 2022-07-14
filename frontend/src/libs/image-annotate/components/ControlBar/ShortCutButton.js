import React, { useMemo, useState, useEffect } from "react";
import Dropdown from "antd/lib/dropdown";
import List from "antd/lib/list";
import Button from "antd/lib/button";
import { styled } from "@material-ui/styles";
import TableOutlined from "@ant-design/icons/TableOutlined";
import useImageAnnotate from "@libs/image-annotate/contexts/ImageAnnotateContext";
import { useHotkeyStorage } from "@components/HotkeyStorage";
import { HotKeys, recordKeyCombination } from "react-hotkeys";
import { useImageAnnotateHotkeyStorage } from "@libs/image-annotate/contexts/ImageAnnotateHotkeysContext";

const ListItemContainer = styled("div")({
  display: "flex",
  padding: "5px",
  width: 300,
});

const ListItemDescription = styled("div")({
  display: "flex",
  alignItems: "center",
  marginRight: 10,
  fontWeight: "bold",
  fontSize: "0.8rem",
});

const ListItemKeys = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  flexGrow: 1,
});

const ItemKey = styled("div")({
  background: "rgb(232, 235, 237)",
  fontWeight: "bold",
  color: "rgb(84, 78, 78)",
  padding: 5,
  borderRadius: 10,
  margin: "0px 2px",
  minWidth: 30,
  textAlign: "center",
});

const ShortcutButton = () => {
  const [isActive, setIsActive] = useState(false);
  const { tools } = useImageAnnotate();
  const { hotkeys } = useImageAnnotateHotkeyStorage();

  useEffect(() => {
    recordKeyCombination((param) => {
    });
  }, []);

  const overlay = useMemo(
    () => (
      <List>
        {hotkeys.map((hotkey) => {
          return (
            <List.Item key={hotkey.id} style={{ padding: 6 }}>
              <ListItemContainer>
                <ListItemDescription>{hotkey.description}</ListItemDescription>
                <ListItemKeys>
                  {hotkey.binding &&
                    hotkey.binding.map((key, index) => (
                      <ItemKey key={hotkey.description + index}>{key}</ItemKey>
                    ))}
                </ListItemKeys>
              </ListItemContainer>
            </List.Item>
          );
        })}
      </List>
    ),
    []
  );
  return (
    <Dropdown overlay={overlay} trigger={["click"]} visible={isActive}>
      <Button
        type="text"
        icon={<TableOutlined />}
        style={{ background: isActive && "#66BAFF" }}
        onClick={(e) => {
          setIsActive((prev) => !prev);
        }}
      ></Button>
    </Dropdown>
  );
};

export default ShortcutButton;
