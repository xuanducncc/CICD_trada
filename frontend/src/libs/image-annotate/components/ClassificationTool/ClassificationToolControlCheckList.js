import React, { useCallback } from "react";
import useClassificationToolControl from "./ClassificationToolControlContext";
import { Checkbox, Row, Col } from 'antd';
import "./css/ClassificationToolControlCheckList.css";
const ClassificationToolControlCheckList = () => {

    const {
        selectClasses,
        labels,
        labeledValue,
        setLabeledValue
    } = useClassificationToolControl();
    const checkBoxOption = labels.map((lb) => ({
        label: lb.name,
        value: lb.id,
    }))

    return (
        <Checkbox.Group options={checkBoxOption} value={labeledValue} onChange={(checkedValue) => {
            selectClasses(checkedValue)
             setLabeledValue(checkedValue);
        }}>
        </Checkbox.Group>


    )

}

export default ClassificationToolControlCheckList;