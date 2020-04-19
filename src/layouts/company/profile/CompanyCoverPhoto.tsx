import React, { useState } from "react";
import { ICompany } from "stores/company/Reducer";
import { Dialog, Button } from "@blueprintjs/core";
import { connect } from "react-redux";
import { CompanyProfilePicture } from "./CompanyProfilePicture";
// import editIcon from "../../../resources/images/editIcon.png";
import coverPic from "resources/images/coverPhoto.png";
import { ImageEdit } from "./ImageEditor";

interface ICompanyCoverUploadViewProps {
  currentCompany: ICompany;
}

const CompanyCoverPhotoComponent = (props: ICompanyCoverUploadViewProps) => {
  const [showDialogPicture, setShowDialogPicture] = useState(false);
  // const [showDialogPosition, setShowDialogPosition] = useState(false);

  return (
    <>
      <div
        className="relative cover br4 w-100"
        style={{
          backgroundImage: `url(${
            props.currentCompany.coverImage
              ? props.currentCompany.coverImage
              : coverPic
            })`,
          height: "340px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          objectFit: "cover"
        }}
      >
        <div className="absolute flex" style={{ left: "40px", top: "63%" }}>
          <div
            className="pa2 bg-white cf tc shadow-4 br2  pointer hover-bg-dark-gray"
            style={{ width: "235px", height: "235px" }}
          >
            <CompanyProfilePicture />
          </div>

          <div className="flex flex-grow-1 justify-between">
            <div className="flex">
              <div className="ml5 ml1-m" style={{ marginTop: "15rem" }}>
                <h1 className="f6 ma0 ws-break ttc">Total Employee</h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break">{props.currentCompany.totalMember}</h1>
              </div>
              <div className="ml4 ml1-m" style={{ marginTop: "15rem" }}>
                <h1 className="f6 ma0 ws-break ttc">Associates</h1>
                <h1 className="f3-l f4 fw4 ma0 ws-break">{props.currentCompany.totalAssociate}</h1>
              </div>
            </div>

            {/* <Button
              className="pa2 bp3-minimal"
              style={{
                color: 'white',
                backgroundColor: '#3F61C5',
                marginTop: '9rem',
                height: '40px',
                width: '200px'
              }}
              icon="tick"
              text="Request Sent"
            /> */}
          </div>
          {/* <Button
            className="bp3-minimal"
            style={{
              color: "white",
              backgroundColor: "#3F61C5",
              marginTop: "15rem",
              marginLeft: "15rem",
              height: "40px",
              width: "200px"
            }}
            text="Add as Associates"
          /> */}
        </div>

        <Button
          className="fr ba bw1 pa2 w-15-l w-23-m bp3-minimal br3"
          style={{
            marginTop: "265px",
            marginRight: "45px",
            color: "#0fa3a3"
          }}
          onClick={() => setShowDialogPicture(true)}
        >
          Change Cover
        </Button>
        {showDialogPicture && (
          <Dialog
            icon="briefcase"
            onClose={() => setShowDialogPicture(!showDialogPicture)}
            isOpen
            style={{ background: "#fff" }}
            canOutsideClickClose={false}
          >
            <ImageEdit
              setShowDialog={setShowDialogPicture}
              type="company-cover-photo"
            />
          </Dialog>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentCompany: state.companyReducer.currentCompany
  };
};

export const CoverPhotoView = connect(mapStateToProps)(
  CompanyCoverPhotoComponent
);
