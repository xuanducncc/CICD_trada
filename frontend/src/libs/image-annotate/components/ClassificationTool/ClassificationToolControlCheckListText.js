import React, { useCallback, useMemo } from 'react';
import { Select } from 'antd';
import useClassificationToolControl from "./ClassificationToolControlContext";
// import { Select } from 'antd';

const { Option } = Select;

const ClassificationToolControlCheckListText = () => {

    const {
        selectClasses,
        selectClassForTextField,
        labels
    } = useClassificationToolControl();
    function handleChange(value) {
        selectClassForTextField(value)
    }

    const children = useMemo(() => {
        let initialSelectOptions = labels.map((lb) => (
            <Option key={lb.code}>{lb.code}</Option>
        )) || []
        return initialSelectOptions
    }, [labels]
    )


    return (

        <Select mode="tags" style={{ width: '100%' }} placeholder="Select labels or type " onChange={handleChange}>
            {children}
        </Select>

    )




}
export default ClassificationToolControlCheckListText