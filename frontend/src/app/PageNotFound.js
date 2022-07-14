import Button from "antd/lib/button";
import Result from "antd/lib/result";
import React from "react";
import { useHistory } from "react-router-dom";

const PageNotFound = () => {
    const history = useHistory();
    return(<Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={() => history.push('/')}>Back Home</Button>}
    />)
};

export default PageNotFound;
