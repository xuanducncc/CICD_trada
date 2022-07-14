import Radio from "antd/lib/radio";
import Space from "antd/lib/space";
import React, { useCallback, useEffect, useRef } from "react";
import useClassificationToolControl from "./ClassificationToolControlContext";

const ClassificationToolControlRadio = () => {
  const {
    selectClass,
    labels,
    valueId,
    control,
    selectedOptionIndex,
    isActive,
    disabled,
  } = useClassificationToolControl();

  const handleClassChange = useCallback(
    (evt) => {
      const value = evt.target.value;
      selectClass(value);
    },
    [selectClass]
  );

  return (
    <Radio.Group
      disabled={disabled}
      onChange={handleClassChange}
      value={valueId}
    >
      <Space direction="vertical">
        {(labels || []).map((label, index) => {
          return (
            <Radio
              style={{
                backgroundColor:
                  selectedOptionIndex === index ? "#40a9ffcc" : "transparent",
              }}
              autoFocus={index === 0 && isActive}
              key={label.id}
              value={label.id}
            >
              {label.name}
            </Radio>
          );
        })}
      </Space>
    </Radio.Group>
  );
};

export default ClassificationToolControlRadio;
