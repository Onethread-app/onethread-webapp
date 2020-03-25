import React, { useState } from "react";
import { User } from "stores/user/Reducer";
import { Dialog } from "@blueprintjs/core";
import { connect } from "react-redux";
import { ImageEdit } from "./ImageEditor";
import DefaultUserImage from "./../../../resources/images/profilePhoto.svg";
interface IProfilePictureViewProps {
  user: User;
}

const ProfilePictureViewComponent = (props: IProfilePictureViewProps) => {
  const [showDialogPicture, setShowDialogPicture] = useState(false);

  return (
    <>
      <div>
        <img
          onClick={() => setShowDialogPicture(true)}
          className=""
          style={{ objectFit: "cover", width: "220px", height: "220px" }}
          src={
            props.user.profileImage ? props.user.profileImage : DefaultUserImage
          }
        />
      </div>
      {showDialogPicture && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogPicture(!showDialogPicture)}
          isOpen
          style={{ background: "#fff" }}
          canOutsideClickClose={false}
        >
          <ImageEdit setShowDialog={setShowDialogPicture} type="profilePic" />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user
  };
};

export const ProfilePictureView = connect(mapStateToProps)(
  ProfilePictureViewComponent
);
