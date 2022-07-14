import React from "react";
import { MemberListProvider } from "./MemberListContext";
import PageLayout from "../../../../components/PageLayout/PageLayout";
import UserInfo from "./UserInfo";

const MemberListPage = () => {
    return (
        <MemberListProvider>
            <PageLayout>
                <UserInfo />
            </PageLayout>
        </MemberListProvider>
    )
}

export default MemberListPage;