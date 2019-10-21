import React, { useState } from 'react';
import { Icon, Divider, Dialog, Button, Tag, EditableText, Tabs, Tab } from '@blueprintjs/core';
import skill from '../resources/images/skills.png';
import user from '../resources/images/user.png';
import { connect } from 'react-redux';
import { SuggestField, ItemEntityProps } from 'components/common/field/SuggestField';
import { ListTitleView } from 'components/ListTitleView';
import { SectionViewWithTitleAndDesciption } from 'components/ListItemView';
import { BasicInfoForm } from 'components/company/profile/editor/BasicInfoDetailsForm';
import 'react-vertical-timeline-component/style.min.css';
import { User } from 'stores/user/Reducer';
import { ExperienceView } from 'components/company/profile/view/ExperienceView';
import { JobFormComponent } from 'components/company/profile/editor/JobForm';
// import { EducationFormComponent } from 'components/company/profile/editor/EducationForm';
import { isNumber } from 'lodash';
import { EducationFormComponent } from 'components/company/profile/editor/EducationForm';
import { addJobExperienceAction, addEducationExperienceAction } from 'stores/user/Actions';

interface LandingPageProps {
  user: User,
  addJobExperienceAction: (val: any) => void
  addEducationExperienceAction: (val: any) => void
}

const skills = [
  { _id: '1', name: 'Programing C' },
  { _id: '2', name: 'Java' },
  { _id: '3', name: 'Dotnet' },
  { _id: '4', name: 'Javascript' },
  { _id: '5', name: 'React' },
]

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
    endingYear: ""
  });
  const [educationInfo, setEducationInfo] = useState({
    degree: "",
    institutionName: "",
    startYear: "",
    endingYear: ""
  });
  const handleSelectedTab = (id: any) => {
    setsSelectedTab(id);
    console.log(id);
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
    console.log('job', jobInfo)
  }

  const handleEducationDateChange = (name: string, date: Date) => {
    setEducationInfo({
      ...educationInfo, [name]: date.toLocaleDateString()
    });
    console.log('edu', jobInfo)

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
          panel={<JobFormComponent handleChange={handleJobChange} values={jobInfo} handleDateChange={handleJobDateChange} />}
          className="outline-0"
        />
        <Tab
          id="Educations"
          title="Educations"
          panel={<EducationFormComponent handleChange={handleEducationChange} values={educationInfo} handleDateChange={handleEducationDateChange} />}
          className="outline-0"
        />
      </Tabs>
      <div className="fr mr4">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
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
              props.addJobExperienceAction(jobInfo);
              props.setShowDialog(false);
            } else if (selectedTab === "Educations") {
              console.log(selectedTab)
              props.addEducationExperienceAction(educationInfo);
              props.setShowDialog(false);
            }
          }}
        >
          Save
      </Button>
      </div>
    </div>
  )
}

const SkillEdit = (props: {
  setShowDialog: (val: boolean) => void;
}) => {
  // TODO Should comes from redux store
  const [selectedItems, setSelectedItems] = useState([] as ItemEntityProps[]);
  return (
    <>
      <div className="pa3 ">
        <h1 className="f5 lh-copy">Add your skills</h1>
        <div className="fl w-100 pv2">
          <SuggestField
            items={skills}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
        <div className="fl w-100 mb2">
          {selectedItems.map(item => (
            <Tag
              key={item._id}
              className="ma1 pa2"
              interactive={true}
              intent="primary"
              onRemove={e => {
                const filteredItems = selectedItems.filter(selectedItem => (
                  item.name !== selectedItem.name
                ));
                setSelectedItems([
                  ...filteredItems
                ])
              }}
              large={true}
            >
              {item.name}
            </Tag>
          ))}
        </div>
        <div className="fl w-100">
          <div className="flex justify-end">
            <Button className="w4 grow h2 pointer mr3"
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
              style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
            >
              cancel
            </Button>
            <Button
              type="submit"
              onClick={(e: any) => {
                e.preventDefault();
                props.setShowDialog(false);
              }}
              className="w4 grow h2 pointer"
              style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
            >
              Save
            </Button>
          </div>
        </div>

      </div>
    </>
  )
}

const SkillView = () => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <div className="h-auto br3 ma2 pa3 bg-white cf">
        <h1 className="f6 lh-copy">Skills</h1>
        <div className="tc">
          <img src={skill}></img>
          <p>No skill has selected</p>
          <button
            className="br3 grow ph4 pointer pv2 f7 bg-white ba b--lightBlue tigrow-lightBlue outline-0"
            onClick={() => setShowDialog(!showDialog)}
          >
            Add Skills
      </button>
        </div>
      </div>
      {
        showDialog && (
          <Dialog
            onClose={() => setShowDialog(!showDialog)}
            isOpen={showDialog}
            style={{ background: '#fff' }}
            canOutsideClickClose={false}
          >
            <SkillEdit setShowDialog={setShowDialog} />
          </Dialog>
        )
      }
    </>
  )
}

const AboutEdit = (props: {
  setShowDialog: (val: boolean) => void;
}) => {
  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
      <EditableText className="mb4" multiline={true} minLines={3} maxLines={20} />>
      <Divider />
      <div className="flex justify-end mt3">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
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
            props.setShowDialog(false);
          }}
        >
          Save
        </Button>
      </div>
    </form>

  )
}

const AboutView = () => {
  const [showDialogAbout, setShowDialogAbout] = useState(false);
  return (
    <>
      <div className="h-auto br3 ma2 pa3 bg-white cf">
        <div className="cf ">
          <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
          <Icon className="fr mv3 tigrow-lightBlue pointer"
            icon="edit"
            onClick={() => setShowDialogAbout(true)}
          />
        </div>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
           Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
       when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
      </div>
      {showDialogAbout && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogAbout(!showDialogAbout)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <AboutEdit setShowDialog={setShowDialogAbout} />
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
      <div className="br3 bg-white h-auto pa4 mt3">
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
          listTitle="Contact Number"
          listDescription={props.user.contactNo}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Gender"
          listDescription="Male"
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Birthdate"
          listDescription="13th September, 2019"
        />
      </div>
    </>
  )
}

export const LandingPageComponent = (props: LandingPageProps) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <div className="cf w-100" >
        <h1 className="f5 lh-title tigrow-lightGray-1 ml3 tigrow-lightGray-1 mb0">Profile</h1>
        <div>
          <div className="fl w-25-ns pa2 ">
            <div className="h-auto br3 ma2 pa3 bg-white cf tc">
              <img src={user}></img>
              <h1 className="f6 lh-copy tigrow-lightGray-1">{props.user.firstName}</h1>
              <p className="tigrow-lightGray-1">Software Dev</p>
            </div>
            <AboutView />
            <SkillView />
          </div>
          <div className="fl w-75-ns">
            <BasicInfoDetailsView user={props.user} />

            <div className="br3 bg-white h-auto pa4 mt3">
              <ListTitleView
                listTitle="Experience"
                iconType="add"
                onClick={() => setShowDialog(true)}
              />
              <div className="br3 bg-white h-auto">
                <img src={skill}></img>
                <p>No experience has added</p>
              </div>
              <Divider />
              <ExperienceView />
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

    </>
  )
}

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  }
}

export const LandingPage = connect(mapStateToProps, { addJobExperienceAction, addEducationExperienceAction })(LandingPageComponent)