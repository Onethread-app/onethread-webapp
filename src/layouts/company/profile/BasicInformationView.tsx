import React, { useState } from "react";
import { Dialog, Divider, Button, Icon, Spinner } from "@blueprintjs/core";
import { connect } from "react-redux";
import { CompanyInfoForm } from "./BasicInformationEditor";
import { companyLogoUploadAction } from "stores/company/Actions";
import { companyPermit } from "stores/UtilsActions";
import { isEmpty } from "lodash";
import { CompanyAboutView } from "./AboutView";

import UserImage from "./../../../resources/images/CompanyIcon.svg";

const BasicInfoDetailsViewComponent = (props: any) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogPicture, setShowDialogPicture] = useState(false);
  const [imageSelected, setImageSelected] = useState({}) as any;
  const [imageName, setImageName] = useState({}) as any;
  const [logoLoading, setLogoLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageChangeHandler = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        if (event.target.files[0].size / 1024 / 1024 > 5) {
          setImageName("");
          setImageError(true);
          return false;
        } else {
          const data = new FormData();
          data.append(
            "file",
            event.target.files[0],
            event.target.files[0].name
          );
          setImageName(event.target.files[0]);
          setImageSelected(data);
          setImageError(false);
          return data;
        }
      }
    }
    return false;
  };
  return (
    <>
      <div>
        <div className="fl-l flex-m w-25-l w-100-m ph3">
          <div className="h-auto br3 ma3 pa3 bg-white cf tc shadow-4 w-50-m">
            <div className="cf flex relative center" style={{ width: "112px" }}>
              <img
                className="db br-100 ba b--black-10"
                style={{ width: "112px", height: "112px" }}
                src={props.company.logo ? props.company.logo : UserImage}
                alt={""}
              />
              {companyPermit(props.company.role, "editProfile") ? (
                <div
                  className="absolute bg-tigrowLightBlue br-100 pointer"
                  onClick={() => setShowDialogPicture(true)}
                  style={{
                    top: "4.5rem",
                    right: "3px",
                    width: "33px",
                    height: "33px",
                    paddingTop: "7px"
                  }}
                >
                  <Icon className="white" icon="camera" iconSize={20}></Icon>
                </div>
              ) : (
                ""
              )}
            </div>
            <h1 className="f5 lh-copy tigrow-lightGray-1 ws-break">
              {props.company.name}
            </h1>
            <p className=" light-silver">{props.company.type}</p>
          </div>
          <CompanyAboutView company={props.company} />
        </div>
        <div className="fl-l mh4-m w-70-l w-90-m ">
          <div className="br3 bg-white h-auto pa4 mt3-l mt2-m shadow-4">
            <div className="cf ">
              <h1 className="f5 lh-copy dib tigrow-lightGray-1">
                Basic Information
              </h1>
              <Icon
                className="fr mv3 tigrow-lightBlue pointer"
                icon={
                  companyPermit(props.company.role, "editProfile")
                    ? "edit"
                    : "blank"
                }
                onClick={() => setShowDialog(true)}
              />
            </div>
            <Divider />
            {showDialog && (
              <Dialog
                onClose={() => setShowDialog(!showDialog)}
                isOpen
                style={{ background: "#fff" }}
              >
                <div>
                  <CompanyInfoForm setShowDialog={setShowDialog} />
                </div>
              </Dialog>
            )}
            <div className="br3 bg-white h-auto">
              <h1 className="f7 lh-copy">Company Address</h1>
              <p className="f6">{props.company.address}</p>
            </div>
            <div className="br3 bg-white h-auto">
              <h1 className="f7 lh-copy">Company Mail Address</h1>
              <p className="f6">{props.company.email}</p>
            </div>
            <div className="br3 bg-white h-auto">
              <h1 className="f7 lh-copy">Legal Owner</h1>
              <p className="f6">{props.company.legalOwnerName}</p>
            </div>
            <div className="br3 bg-white h-auto">
              <h1 className="f7 lh-copy">Legal owner Mail address</h1>
              <p className="f6">{props.company.legalOwnerMail}</p>
            </div>
          </div>
        </div>
      </div>

      {showDialogPicture && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogPicture(!showDialogPicture)}
          isOpen
          style={{ background: "#fff" }}
          canOutsideClickClose={false}
        >
          <div className="pa3 cf">
            <h1 className="f5 tigrow-lightBlue">Upload Photo</h1>
            <label className="bp3-file-input .modifier bp3-fill">
              <input
                type="file"
                accept="image/*"
                onChange={e => imageChangeHandler(e)}
              />
              <span className="bp3-file-upload-input">
                {imageName.name ? imageName.name : <p>choose your file...</p>}
              </span>
            </label>
            {imageError && (
              <small style={{ color: "red" }}>
                Image size can't be greater than 5 MB
              </small>
            )}
            <div className="flex justify-end mt3">
              <Button
                className="w4 grow h2 pointer mr3"
                style={{
                  background: "#fff",
                  outline: "none",
                  border: "1px solid #0fa3a3",
                  color: "#0fa3a3"
                }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialogPicture(false);
                  setImageName({});
                  setLogoLoading(false);
                  setImageError(false);
                }}
              >
                cancel
              </Button>
              <Button
                type="submit"
                className="w4 grow h2 pointer"
                style={
                  imageName && isEmpty(imageName.name) === false
                    ? {
                        background: "#0fa3a3",
                        outline: "none",
                        color: "white"
                      }
                    : {
                        background: "#011b1b2e",
                        outline: "none",
                        color: "white"
                      }
                }
                onClick={async (e: any) => {
                  e.preventDefault();
                  setLogoLoading(true);
                  const response = await props.companyLogoUploadAction(
                    imageSelected
                  );
                  if (response) {
                    setShowDialogPicture(false);
                    setImageName({});
                  }
                  setLogoLoading(false);
                }}
                disabled={
                  logoLoading === true || isEmpty(imageName.name) ? true : false
                }
              >
                {logoLoading ? <Spinner size={15} /> : "Save"}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  };
};

export const BasicInfoDetailsView = connect(mapStateToProps, {
  companyLogoUploadAction
})(BasicInfoDetailsViewComponent);
