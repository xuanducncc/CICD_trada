import Select from 'antd/lib/select';
import React from 'react';
import useClassificationToolControl from './ClassificationToolControlContext';

const ClassificationToolControlDropdown = () => {
  const { selectClass, labels, valueId, name, disabled } = useClassificationToolControl();
  return (
    <Select
    disabled={disabled}
      placeholder={`select a ${name || "class"}`}
      value={valueId}
      onChange={selectClass}
      style={{ width: "100%" }}
    >
      {(labels || []).map((label) => {
        return (
          <Select.Option key={label.id} value={label.id}>
            {label.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default ClassificationToolControlDropdown;
