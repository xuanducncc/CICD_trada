import React from "react";
import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import Input from "antd/lib/input";
import Form from "antd/lib/form";

export const UploadForm = ({ onSubmit, onChange, value, formRef }) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "45ch",
      },
    },
  }));

  const classes = useStyles();
  return (
    <Col>
      <Form ref={formRef}>
        <Form.Item
          label="Dataset name"
          name="name"
          onChange={(e) => onChange(e.target.value)}
          rules={[{ required: true }]}
        >
          <Input
            id="outlined-size-small"
            variant="outlined"
            value={value}
          />
        </Form.Item>
        <Button onClick={() => onSubmit()}>
          Create
      </Button>
      </Form>
    </Col>

  );
};
