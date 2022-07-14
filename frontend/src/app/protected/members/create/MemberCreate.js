import React, { useState } from "react";
import useMemberPage, { withMemberPageContext } from "../MemberPageContext";
import { PROJECT_MEMBER_ROLES } from "@utils/const"
import MemberPageComponent from "../index";
const MemberCreate = () => {
    const { onSubmitForm } = useMemberPage();
    const [isDisable, setDisable] = useState(true);
    const tabs = [
        {
            label: "ADMIN",
            value: PROJECT_MEMBER_ROLES.ADMIN
        },
        {
            label: "LABELER",
            value: PROJECT_MEMBER_ROLES.LABELER
        },
        {
            label: "REVIEWER",
            value: PROJECT_MEMBER_ROLES.REVIEWER
        },
    ];

    const [formData, setFormData] = useState({ role: tabs[0], email: "" });

    const OnChangeForm = (e) => {
        const response = {};
        if (e.target) {
            const value = e.target.value;
            response.email = value;
            setDisable(value.length ? false : true);
        } else {
            response.role = e;
        }
        setFormData(prevState => ({ ...prevState, ...response }));
    };

    const handleSubmit = () => {
        onSubmitForm();
    };

    return (
        <MemberPageComponent
            tabs={tabs}
            OnChangeForm={OnChangeForm}
            isDisable={isDisable}
            handleSubmitForm={handleSubmit}
            formData={formData}
        />
    );
};

export default withMemberPageContext(MemberCreate);