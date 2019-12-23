import React, { useState } from 'react';
import { Icon, Divider, Dialog, Button, EditableText, Tabs, Tab, Spinner } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { BasicInfoForm } from 'layouts/user/profile/BasicInfoDetailsForm';
import 'react-vertical-timeline-component/style.min.css';
import { User } from 'stores/user/Reducer';
import { JobFormComponent } from 'layouts/user/profile/JobDetailsEditor';
import { isNumber, isEmpty } from 'lodash';
import { EducationFormComponent } from 'layouts/user/profile/EducationDetailsEditor';
import { editUserInfoAction, profileImageUploadAction } from 'stores/user/Actions';
import moment from 'moment';
import { addJobExperienceAction, addEducationExperienceAction } from 'stores/user/Actions';
import { ExperienceView } from 'layouts/user/profile/ExperienceView';
import { CompanyModel } from 'stores/company/Reducer';
import { SkillView } from 'layouts/user/profile/Skills';

const DefaultSkillImage = require('./../../../resources/images/skills.png');
const DefaultUserImage = require('./../../../resources/images/user.png');

interface LandingPageProps {
  user: User,
  company: CompanyModel
  addJobExperienceAction: (val: any) => void
  addEducationExperienceAction: (val: any) => void
}

const ExperienceEdit = (props:
  {
    setShowDialog: (val: boolean) => void
    addJobExperienceAction: (val: {}) => void
    addEducationExperienceAction: (val: {}) => void
  }
) => {
  const [jobInfo, setJobInfo] = useState({
    companyName: "",
    positionName: "",
    startYear: "", //TODO: Date type must be used instead of string
    endingYear: "",
    currentlyWork: false,
    jobDescription: ""
  });
  const [educationInfo, setEducationInfo] = useState({
    degree: "",
    institutionName: "",
    startYear: "", //TODO: Date type must be used instead of string
    endingYear: "",
    currentlyStudy: false,
    eduDescription: "",
    // TODO: rename it to educationDescription 
  });

  const [jobErrors, setJobErrors] = useState({
    companyName: "",
    positionName: "",
    startYear: "",
    endingYear: "",
    currentlyWork: "",
  });

  const [educationErrors, setEducationErrors] = useState({
    degree: "",
    institutionName: "",
    startYear: "",
    endingYear: "",
    currentlyStudy: ""
  });





  const handleSelectedTab = (id: any) => {
    setsSelectedTab(id);
  };

  const [selectedTab, setsSelectedTab] = useState("Job");

  const handleJobChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setJobInfo({
      ...jobInfo,
      [name]: value
    });
  };

  const handleJobDateChange = (name: string, date: Date) => {
    setJobInfo({
      ...jobInfo, [name]: date
    });
  }

  const handleEducationDateChange = (name: string, date: Date) => {
    setEducationInfo({
      ...educationInfo, [name]: date
    });
  }
  const handleEducationChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setEducationInfo({
      ...educationInfo,
      [name]: value
    });
  };


  const handleEducationCheck = () => {
    setEducationInfo({
      ...educationInfo, currentlyStudy: !educationInfo.currentlyStudy, endingYear: ""
    });
  }

  const emptyJobErrorCheck = () => {
    if (isEmpty(jobErrors.companyName) && isEmpty(jobErrors.positionName) && isEmpty(jobErrors.startYear) && isEmpty(jobErrors.endingYear) && isEmpty(jobErrors.currentlyWork)) {
      return true;
    } else {
      return false;
    }
  }

  const handleWorkCheck = () => {
    setJobInfo({
      ...jobInfo,
      currentlyWork: !jobInfo.currentlyWork,
      endingYear: ""
    });
  };

  const emptyJobValueCheck = () => {
    if (isEmpty(jobInfo.companyName) || isEmpty(jobInfo.positionName) || jobInfo.startYear === "" || (jobInfo.endingYear === "" && jobInfo.currentlyWork === false)) {
      let e = jobErrors;
      if (isEmpty(jobInfo.companyName)) {
        e = { ...e, companyName: "Required" };
      }
      if (isEmpty(jobInfo.positionName)) {
        e = { ...e, positionName: "Required" };
      }
      if (jobInfo.startYear === "") {
        e = { ...e, startYear: "Required", endingYear: "Required", currentlyWork: "Required" };
      }
      if (jobInfo.endingYear === "" && jobInfo.currentlyWork === false && new Date(jobInfo.startYear).toDateString() != new Date().toDateString()) {
        e = { ...e, currentlyWork: "Required", endingYear: "Required" };
      }
      if (new Date(jobInfo.startYear).toDateString() === new Date().toDateString()) {
        e = { ...e, currentlyWork: "Required" };
      }
      setJobErrors(e);
      return true;
    } else {
      return false;
    }
  }

  const emptyEducationErrorCheck = () => {
    if (isEmpty(educationErrors.degree) && isEmpty(educationErrors.institutionName) && isEmpty(educationErrors.startYear) && isEmpty(educationErrors.endingYear) && isEmpty(educationErrors.currentlyStudy)) {
      return true;
    } else {
      return false;
    }
  }

  const emptyEducationValueCheck = () => {
    if (isEmpty(educationInfo.degree) || isEmpty(educationInfo.institutionName) || educationInfo.startYear === "" || (educationInfo.endingYear === "" && educationInfo.currentlyStudy === false)) {
      let e = educationErrors;
      if (isEmpty(educationInfo.degree)) {
        e = { ...e, degree: "Required" };
      }
      if (isEmpty(educationInfo.institutionName)) {
        e = { ...e, institutionName: "Required" };
      }
      if (educationInfo.startYear === "") {
        e = { ...e, startYear: "Required", endingYear: "Required", currentlyStudy: "Required" };
      }
      if (educationInfo.endingYear === "" && educationInfo.currentlyStudy === false && new Date(educationInfo.startYear).toDateString() != new Date().toDateString()) {
        e = { ...e, currentlyStudy: "Required", endingYear: "Required" };
      }
      if (new Date(educationInfo.startYear).toDateString() === new Date().toDateString()) {
        e = { ...e, currentlyStudy: "Required" };
      }
      setEducationErrors(e);
      return true;
    } else {
      return false;
    }
  }

  return (
    <div>
      <Tabs
        id="TabsExample"
        className="ml4-ns ml3 mt4 mr2"
        onChange={(id) => handleSelectedTab(id)}
        selectedTabId={selectedTab}
      >
        <Tab
          id="Job"
          title="Job"
          panel={<JobFormComponent
            checked={jobInfo.currentlyWork}
            handleCheck={handleWorkCheck}
            handleChange={handleJobChange}
            values={jobInfo}
            handleDateChange={handleJobDateChange}
            minEndYear={jobInfo.startYear === "" ? new Date() : new Date(jobInfo.startYear)}
            emptyErrorCheck={emptyJobErrorCheck}
            emptyValueCheck={emptyJobValueCheck}
            errors={jobErrors}
          />}
          className="outline-0"
        />
        <Tab
          id="Educations"
          title="Educations"
          panel={<EducationFormComponent
            checked={educationInfo.currentlyStudy}
            handleCheck={handleEducationCheck}
            handleChange={handleEducationChange}
            values={educationInfo}
            handleDateChange={handleEducationDateChange}
            minEndYear={educationInfo.startYear === "" ? new Date() : new Date(educationInfo.startYear)}
            emptyErrorCheck={emptyEducationErrorCheck}
            emptyValueCheck={emptyEducationValueCheck}
            errors={educationErrors}
          />}
          className="outline-0"
        />
      </Tabs>
      <div className="fr mr4 mb4">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
          }}
        >
          cancel
      </Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          onClick={(e: any) => {
            e.preventDefault();
            if (selectedTab === "Job") {
              if (!emptyJobValueCheck() && emptyJobErrorCheck()) {
                props.addJobExperienceAction(jobInfo);
                props.setShowDialog(false);
              }
            } else if (selectedTab === "Educations") {
              if (!emptyEducationValueCheck() && emptyEducationErrorCheck()) {
                props.addEducationExperienceAction(educationInfo);
                props.setShowDialog(false);
              }
            }
          }}
        >
          Save
      </Button>
      </div>
    </div>
  )
}




interface AboutEditComponentProps {
  setShowDialog: (val: boolean) => void;
  user: User;
}
interface AboutEditInternalProps extends AboutEditComponentProps {
  editInfoAction: (val: any) => void;
}

const AboutEditComponent = (props: AboutEditInternalProps) => {
  const [values, setValues] = useState({
    about: props.user.about
  });
  const handleChange = (name: string) => (event: any) => {
    const value = event;
    setValues({ ...values, [name]: value });
  };
  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
      <EditableText
        className="mb4"
        multiline={true}
        minLines={3}
        maxLines={20}
        value={values.about}
        onChange={handleChange("about")}
      />
      <Divider />
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
            props.setShowDialog(false);
          }}
        >
          cancel
				</Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={{ background: "#0fa3a3", outline: "none", color: "white" }}
          onClick={(e: any) => {
            e.preventDefault();
            props.editInfoAction(values);
            props.setShowDialog(false);
          }}
        >
          Save
				</Button>
      </div>
    </form>
  );
};
const AboutEdit = connect(null, { editInfoAction: editUserInfoAction })(
  AboutEditComponent
);

export const AboutView = (props: { user: User }) => {
  const [showDialogAbout, setShowDialogAbout] = useState(false);
  return (
    <>
      <div className="h-auto br3 ma3 pa3 bg-white cf shadow-4 w-50-m">
        <div className="cf ">
          <h1
            className="f5 lh-copy dib tigrow-lightGray-1 ws-break"
          >
            About
					</h1>
          <Icon
            className="fr mv3 tigrow-lightBlue pointer"
            icon="edit"
            onClick={() => setShowDialogAbout(true)}
          />
        </div>
        <div>
          <pre className="ws-break" style={{ whiteSpace: 'pre-line' }}>
            {props.user.about}
          </pre>
        </div>
      </div>
      {showDialogAbout && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogAbout(!showDialogAbout)}
          isOpen
          style={{ background: "#fff" }}
        >
          <div>
            <AboutEdit user={props.user} setShowDialog={setShowDialogAbout} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const BasicInfoDetailsView = (props: { user: User }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <div className="br3 bg-white h-auto pa4">
        <div className="cf ">
          <h1 className="f5 lh-copy dib tigrow-lightGray-1">Basic Information</h1>
          <Icon
            className="fr mv3 tigrow-lightBlue pointer"
            icon="edit"
            onClick={() => setShowDialog(true)}
          />
        </div>
        <Divider />
        {showDialog && (
          <Dialog
            icon="briefcase"
            onClose={() => setShowDialog(!showDialog)}
            isOpen
            style={{ background: "#fff" }}
          >
            <div>
              <BasicInfoForm setShowDialog={setShowDialog} />
            </div>
          </Dialog>
        )}
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Email</h1>
          <p className="f6">{props.user.email}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Secondary Email</h1>
          <p className="f6">{props.user.secondaryEmail}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Contact Number</h1>
          <p className="f6">{props.user.contactNo}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Address</h1>
          <p className="f6">{props.user.location}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Blood Group</h1>
          <p className="f6">{props.user.bloodGroup}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Birthdate</h1>
          <p className="f6">
            {props.user.birthDate ? moment(props.user.birthDate).format("MM/DD/YYYY") : ""}
          </p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Gender</h1>
          <p className="f6">{props.user.gender}</p>
        </div>
      </div>
    </>
  );
};

export const LandingPageComponent = (props: LandingPageProps &
{
  profileImageUploadAction: (val: any) => any
  user: {
    profileImage: any
  }
}
) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogPicture, setShowDialogPicture] = useState(false);
  const [imageSelected, setImageSelected] = useState({}) as any;
  const [imageName, setImageName] = useState({}) as any;
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageChangeHandler = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        if (event.target.files[0].size / 1024 / 1024 > 1) {
          setImageName("");
          setImageError(true);
          return false;
        } else {
          const data = new FormData();
          data.append('file', event.target.files[0], event.target.files[0].name);
          setImageName(event.target.files[0]);
          setImageSelected(data);
          setImageError(false);
          return data;
        }
      }
    }
    return false
  }

  return (
    <>
      <div className="cf w-100" >
        <h1 className="f4 tigrow-lightGray-1 ml4 tigrow-lightGray-1 mb0 mt5">Profile</h1>
        <div className="mt1">
          <div className="fl-l flex-m w-25-l w-100-m ph3">
            <div className="h-auto br3 ma3 pa3 bg-white cf tc shadow-4 w-50-m">
              <div className="cf flex relative center" style={{ width: '112px' }}>
                <img
                  className="db br-100 ba b--black-10"
                  style={{ width: '112px', height: '112px', objectFit: "cover" }}
                  src={props.user.profileImage ? props.user.profileImage.imageSource : DefaultUserImage}
                />
                <div className="absolute bg-tigrowLightBlue br-100 pointer"
                  onClick={() => setShowDialogPicture(true)}
                  style={{ top: '4.5rem', right: '3px', width: '33px', height: '33px', paddingTop: '7px' }}
                >
                  <Icon className="white" icon="camera" iconSize={20} ></Icon>
                </div>
              </div>
              <h1 className="f6 lh-copy tigrow-lightGray-1 ws-break">{props.user.firstName} {props.user.lastName}</h1>
            </div>
            <AboutView user={props.user} />
            <SkillView setShowDialog={setShowDialog} />
          </div>
          <div className="fl-l mh4-m  w-70-l w-90-m mt3-l">
            <div className="br3 bg-white h-auto pa4 shadow-4">
              <div className="cf ">
                <h1 className="f5 lh-copy dib tigrow-lightGray-1">Experience</h1>
                <Icon
                  className="fr mv3 tigrow-lightBlue pointer"
                  icon="add"
                  onClick={() => setShowDialog(true)}
                />
              </div>
              <Divider />
              {props.user.timeline.length > 0 ?
                <ExperienceView />
                :
                <div className="br3 bg-white h-auto tc">
                  <img src={DefaultSkillImage}></img>
                  <p>No experience has added</p>
                </div>
              }
            </div>
            <div className="mt3 mb4 shadow-4">
              <BasicInfoDetailsView user={props.user} />
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <ExperienceEdit addJobExperienceAction={props.addJobExperienceAction} addEducationExperienceAction={props.addEducationExperienceAction} setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
      {showDialogPicture && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogPicture(!showDialogPicture)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="pa3 cf">
            <h1 className="f5 tigrow-lightBlue">Upload Photo</h1>
            <label className="bp3-file-input .modifier bp3-fill">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => imageChangeHandler(e)}
              />
              <span className="bp3-file-upload-input">
                {imageName.name ? imageName.name : <p>choose your file...</p>}
              </span>
            </label>
            {imageError &&
              <small style={{ color: 'red' }}>Image size can't be greater than 1 MB</small>}
            <div className="flex justify-end mt3">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialogPicture(false);
                  setImageName({});
                  setImageLoading(false);
                  setImageError(false);
                }}
              >
                cancel
              </Button>
              <Button
                type="submit"
                className="w4 grow h2 pointer"
                style={imageName && isEmpty(imageName.name) === false ?
                  {
                    background: "#0fa3a3",
                    outline: "none",
                    color: 'white'
                  } : {
                    background: '#011b1b2e',
                    outline: "none",
                    color: 'white'
                  }
                }
                onClick={async (e: any) => {
                  e.preventDefault();
                  setImageLoading(true);
                  const response = await props.profileImageUploadAction(imageSelected);
                  if (response) {
                    setShowDialogPicture(false);
                    setImageName({});
                  }
                  setImageLoading(false);
                }}
                disabled={imageLoading === true || isEmpty(imageName.name) ? true : false}
              >
                {imageLoading ? <Spinner size={15} /> : 'Save'}
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
  }
}

export const LandingPage = connect(mapStateToProps, { addJobExperienceAction, addEducationExperienceAction, profileImageUploadAction })(LandingPageComponent)
