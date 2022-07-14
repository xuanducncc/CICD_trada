import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import Select from "antd/lib/select";
import React, { useState, useEffect, useCallback } from "react";
import { PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { Checkbox } from 'antd';
import DropdownMenu from "../../app/protected/projects/detail/overview/DropdownMenu";
import useUsersListRequester from "@core/hooks/useUsersListRequester";

const PROJECT_MEMBER_ROLES = [
  {
    label: "Admin",
    value: "ADMIN",
  },
  {
    label: "Labeler",
    value: "LABELER",
  },
  {
    label: "Reviewer",
    value: "REVIEWER",
  },
];

const defautCheckList = [
  'LABELER',
  'REVIEWER'
]

const AddMemberComponent = ({ onAddMember, users }) => {
  const [dataInput, SetData] = useState({ organizationRole: ["LABELER", "REVIEWER"], status: "INVITED" });
  const [checkList, setCheckList] = useState(defautCheckList);
  const { Option } = Select;

  const handleAdd = () => {
    onAddMember(dataInput);
    setCheckList(defautCheckList);
    SetData({ organizationRole: ["LABELER", "REVIEWER"], status: "INVITED" });
  };
  const onChange = useCallback(
    (value) => {
      const newMember = users.find((member) => member.id === value);
      SetData({ ...dataInput, ...newMember });
    },
    [users, SetData, dataInput]
  );

  const changeRole = useCallback(
    (value) => {
      setCheckList(value)
      SetData({ ...dataInput, organizationRole: value, status: "INVITED" });
    },
    [SetData, dataInput]
  );

  return (
    <Row style={{ marginBottom: "20px" }}>
      <Col style={{ marginRight: "20px" }}>
        <Select
          style={{ width: 200 }}
          value={dataInput?.id}
          defaultValue={null}
          placeholder="Select an user"
          optionFilterProp="children"
          onChange={onChange}
        >
          {users
            ? users?.map((member) => (
              <Option key={member.id} value={member.id} >
                <Col style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text style={{ overflowX: "hidden", width: "90%", textOverflow: "ellipsis" }}>{member.username}</Text>
                  <Text>{Math.ceil(member.credit_score)}</Text>
                </Col>
              </Option>
            ))
            : null}
        </Select>
      </Col>
      <Col>
        <Row justify="space-between">
          <>
            <Col style={{ marginRight: "20px", margin: "auto" }}>
              <Checkbox.Group
                disabled={!dataInput?.username}
                onChange={changeRole}
                style={{ display: "inline" }}
                value={checkList}
                defaultValue={defautCheckList}
                options={PROJECT_MEMBER_ROLES}
              >
              </Checkbox.Group>
            </Col>
            <Col>
              <Button
                disabled={checkList.length === 0 || !dataInput?.username}
                type="primary"
                onClick={() => {
                  handleAdd();
                }}
              >
                Add
              </Button>
            </Col>
          </>
        </Row>
      </Col>
    </Row>
  );
};

export default AddMemberComponent;
