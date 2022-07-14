import React, { useState } from "react";
import useMemberPage, { withMemberPageContext } from "../MemberPageContext";
import MemberPageComponent from "../index";
const MemberCreate = () => {
    const { onSubmitForm, memberDetailt } = useMemberPage();

    const [isDisable, setDisable] = useState(true);
    const tabs = ["Amdin", "Labeler", "Reviewer"];

    const [formData, setFormData] = useState({role: tabs[0], email: ""});

    const OnChangeForm = (e) => {
        const response = {};
        if(e.target) {
            const value = e.target.value;
            response.email = value;
            setDisable(value.length?false:true);
        } else {
            response.role = e;
        }
        setFormData(prevState => ({...prevState, ...response }));
    };

    const handleSubmit = () => {
        onSubmitForm();
    };

    const isMine = true;
    
    return (
        <MemberPageComponent 
            tabs={tabs}
            OnChangeForm={OnChangeForm}
            isMine={isMine}
            isDisable={isDisable}
            handleSubmitForm={handleSubmit}
            formData={formData}
            data={memberDetailt.member}
        />
    );
};

export default withMemberPageContext(MemberCreate);