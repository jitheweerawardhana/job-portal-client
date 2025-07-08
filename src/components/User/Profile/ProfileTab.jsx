import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../AppContext";
import CreateProfileModal from "./CreateProfileModal";
import EmptyProfileState from "./EmptyProfileState";
import ProfileView from "./ProfileView";

const ProfileTab = () => {
  const { userProfileData, token } = useContext(AppContext);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    console.log("User profile data updated:", userProfileData);
  }, [userProfileData]);

  const handleCreateProfile = () => {
    setShowCreateForm(true);
  };

  // If profile data is loading or not available
  if (!userProfileData) {
    return (
      <>
        <EmptyProfileState onCreateProfile={handleCreateProfile} />
        {showCreateForm && (
          <CreateProfileModal
            onClose={() => setShowCreateForm(false)}
            token={token}
          />
        )}
      </>
    );
  }

  return <ProfileView userProfileData={userProfileData} />;
};

export default ProfileTab;
