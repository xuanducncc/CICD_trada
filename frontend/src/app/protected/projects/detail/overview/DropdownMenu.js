import React, { useState } from "react";
import Select from "antd/lib/select";
const { Option } = Select;

const DropdownMenu = ({ data, onChange, disabled, defaultValue, value, placeholder }) => {
  const onChangeMenu = (value) => {
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <Select
      style={{ width: 200 }}
      placeholder={placeholder || "Select format"}
      optionFilterProp="children"
      defaultValue={defaultValue}
      value={value}
      disabled={disabled}
      onChange={onChangeMenu}
    >
      {data ? (
        data.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label || ""}
          </Option>
        ))
      ) : (
        <></>
      )}
    </Select>
  );
};
export default DropdownMenu;
