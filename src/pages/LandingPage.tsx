import React, { useState } from 'react';
import { Icon, Divider, Dialog, Button, EditableText, Tabs, Tab, FileInput } from '@blueprintjs/core';
import skill from '../resources/images/skills.png';
import user from '../resources/images/user.png';
import { connect } from 'react-redux';
import { ListTitleView } from 'components/ListTitleView';
import { SectionViewWithTitleAndDesciption } from 'components/ListItemView';
import { BasicInfoForm } from 'components/user/BasicInfoDetailsForm';
import 'react-vertical-timeline-component/style.min.css';
import { User } from 'stores/user/Reducer';
import { JobFormComponent } from 'components/company/profile/editor/JobForm';
import { isNumber } from 'lodash';
import { EducationFormComponent } from 'components/company/profile/editor/EducationForm';
import { editUserInfoAction } from 'stores/user/Actions';
import moment from 'moment';
import { addJobExperienceAction, addEducationExperienceAction } from 'stores/user/Actions';
import { isEmpty } from 'lodash';
import { ExperienceView } from 'components/company/profile/view/ExperienceView';
import { CompanyModel } from 'stores/company/Reducer';
import { SkillView } from 'components/user/Skills';

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
    startYear: "",
    endingYear: "",
    currentlyWork: false,
    jobDescription: ""
  });
  const [educationInfo, setEducationInfo] = useState({
    degree: "",
    institutionName: "",
    startYear: "",
    endingYear: "",
    currentlyStudy: false,
    eduDescription: "",
    // TODO: rename it to educationDescription 
  });

  const handleSelectedTab = (id: any) => {
    setsSelectedTab(id);
  }

  const [selectedTab, setsSelectedTab] = useState("Job");

  const handleJobChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setJobInfo({
      ...jobInfo, [name]: value
    });
  }

  const handleEducationChange = (name: string | number) => (event: any) => {
    const value = isNumber(event) ? event.toString() : event.target.value;
    setEducationInfo({
      ...educationInfo, [name]: value
    });
  }

  const handleJobDateChange = (name: string, date: Date) => {
    setJobInfo({
      ...jobInfo, [name]: date.toLocaleDateString()
    });
  }

  const handleEducationDateChange = (name: string, date: Date) => {
    setEducationInfo({
      ...educationInfo, [name]: date.toLocaleDateString()
    });
  }

  const handleWorkCheck = () => {
    setJobInfo({
      ...jobInfo, currentlyWork: !jobInfo.currentlyWork, endingYear: ""
    });
  }

  const handleEducationCheck = () => {
    setEducationInfo({
      ...educationInfo, currentlyStudy: !educationInfo.currentlyStudy, endingYear: ""
    });
  }
  const emptyJobInfo = () => {
    if (isEmpty(jobInfo.companyName) || isEmpty(jobInfo.positionName) || isEmpty(jobInfo.startYear) || (isEmpty(jobInfo.endingYear) && !jobInfo.currentlyWork)) {
      return false;
    } else {
      return true;
    }
  }
  const emptyEducationInfo = () => {
    if (isEmpty(educationInfo.degree) || isEmpty(educationInfo.institutionName) || isEmpty(educationInfo.startYear) || (isEmpty(educationInfo.endingYear) && !educationInfo.currentlyStudy)) {
      return false;
    } else {
      return true;
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
            minEndYear={!jobInfo.startYear ? new Date() : new Date(jobInfo.startYear)}
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
            minEndYear={!educationInfo.startYear ? new Date() : new Date(educationInfo.startYear)}
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
              if (emptyJobInfo() === true) {
                props.addJobExperienceAction(jobInfo);
                props.setShowDialog(false);
              }
            } else if (selectedTab === "Educations") {
              if (emptyEducationInfo() === true) {
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
  editInfoAction: (val: any) => void
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
            props.editInfoAction(values);
            props.setShowDialog(false);
          }}
        >
          Save
        </Button>
      </div>
    </form>

  )
}
const AboutEdit = connect(null, { editInfoAction: editUserInfoAction })(AboutEditComponent)

export const AboutView = (props: {
  user: User
}) => {
  const [showDialogAbout, setShowDialogAbout] = useState(false);
  return (
    <>
      <div className="h-auto br3 ma3 pa3 bg-white cf shadow-4 w-50-m">
        <div className="cf ">
          <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
          <Icon className="fr mv3 tigrow-lightBlue pointer"
            icon="edit"
            onClick={() => setShowDialogAbout(true)}
          />
        </div>
        <p>{props.user.about}</p>
      </div>
      {showDialogAbout && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogAbout(!showDialogAbout)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <AboutEdit user={props.user} setShowDialog={setShowDialogAbout} />
          </div>
        </Dialog>
      )}
    </>
  )
}

const BasicInfoDetailsView = (props: {
  user: User
}) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div className="br3 bg-white h-auto pa4">
        <ListTitleView
          listTitle="Basic Information"
          iconType="edit"
          onClick={() => setShowDialog(true)}
        />
        {showDialog && (
          <Dialog
            icon="briefcase"
            onClose={() => setShowDialog(!showDialog)}
            isOpen
            style={{ background: '#fff' }}
          >
            <div>
              <BasicInfoForm setShowDialog={setShowDialog} />
            </div>
          </Dialog>
        )}
        <SectionViewWithTitleAndDesciption
          listTitle="Email"
          listDescription={props.user.email}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Secondary Email"
          listDescription={props.user.secondaryEmail}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Contact Number"
          listDescription={props.user.contactNo}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Address"
          listDescription={props.user.location}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Blood Group"
          listDescription={props.user.bloodGroup}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Birthdate"
          listDescription={` ${props.user.birthDate ? moment(props.user.birthDate).format("MM/DD/YYYY") : ''}`}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Gender"
          listDescription={props.user.gender}
        />

      </div>
    </>
  )
}

export const LandingPageComponent = (props: LandingPageProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogPicture, setShowDialogPicture] = useState(false);
  return (
    <>
      <div className="cf w-100" >
        <h1 className="f4 tigrow-lightGray-1 ml4 tigrow-lightGray-1 mb0 mt5">Profile</h1>
        <div className="mt1">
          <div className="fl-l flex-m w-25-l w-100-m ph3">
            <div className="h-auto br3 ma3 pa3 bg-white cf tc shadow-4 w-50-m">
              <div className="cf flex relative center" style={{ width: '112px' }}>
                <img className="db br-100 ba b--black-10" style={{ minWidth: '110px' }} src={user} />
                <div className="absolute bg-tigrowLightBlue br-100 pointer"
                  onClick={() => setShowDialogPicture(true)}
                  style={{ top: '4.5rem', right: '3px', width: '33px', height: '33px', paddingTop: '7px' }}
                >
                  <Icon className="white" icon="camera" iconSize={20} ></Icon>
                </div>
              </div>
              <h1 className="f6 lh-copy tigrow-lightGray-1">{props.user.firstName}</h1>
            </div>
            <AboutView user={props.user} />
            <SkillView setShowDialog={setShowDialog} />
          </div>
          <div className="fl-l mh4-m  w-70-l w-90-m mt3-l">
            <div className="br3 bg-white h-auto pa4 shadow-4">
              <ListTitleView
                listTitle="Experience"
                iconType="add"
                onClick={() => setShowDialog(true)}
              />
              {props.user.timeline.length > 0 ?
                <ExperienceView />
                :
                <div className="br3 bg-white h-auto">
                  <img src={skill}></img>
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
        >
          <div className="pa3 cf">
            <h1 className="f5 tigrow-lightBlue">Upload Photo</h1>
            <FileInput className="bp3-fill" text="Choose file..." />
            <div className="flex justify-end mt3">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialogPicture(false);
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
                }}
              >
                Save
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

export const LandingPage = connect(mapStateToProps, { addJobExperienceAction, addEducationExperienceAction })(LandingPageComponent)