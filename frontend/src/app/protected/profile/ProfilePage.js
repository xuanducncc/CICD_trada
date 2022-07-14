import React from "react";
import './style.css';
import PageLayout from "../../../components/PageLayout/PageLayout";
import UserProfilePage from "./UserProfile";
import { UserProfileProvider } from "./UserProfileContext";

const ProfilePage = () => {
  return (
    <PageLayout>
      <UserProfileProvider>
        <UserProfilePage />
      </UserProfileProvider>
    </PageLayout>

  );
};

export default ProfilePage;
