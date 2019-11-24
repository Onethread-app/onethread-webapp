import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import userProfilePic from '../../../../resources/images/user.png';
import { connect } from 'react-redux';
import moment from 'moment';
import { Dialog, Button, Icon } from '@blueprintjs/core';
import { JobFormComponent } from '../editor/JobForm';
import { isNumber, isEmpty } from 'lodash';
import { EducationFormComponent } from '../editor/EducationForm';
import { editJobExperienceAction, editEducationExperienceAction } from 'stores/user/Actions';
import { User } from 'stores/user/Reducer';

const ExperienceViewComponent = (props: {
  user: User;
  editJobExperienceAction: (jobInfo: {}, id: string) => {};
  editEducationExperienceAction: (eduInfo: {}, id: string) => {};
}) => {
  //TODO: Move this state into JobForm component
  const [jobInfo, setJobInfo] = useState({
    _id: "",
    companyName: "",
    positionName: "",
    startYear: "",
    endingYear: "",
    currentlyWork: false,
    jobDescription: "",
  });
  // TODO: Move this state into EducationForm component
  const [educationInfo, setEducationInfo] = useState({
    _id: "",
    degree: "",
    institutionName: "",
    startYear: "",
    endingYear: "",
    currentlyStudy: false,
    eduDescription: ""
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
      ...jobInfo, [name]: date
    });
  }

  const handleEducationDateChange = (name: string, date: Date) => {
    setEducationInfo({
      ...educationInfo, [name]: date
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

  const emptyJobErrorCheck = () => {
    if (isEmpty(jobErrors.companyName) && isEmpty(jobErrors.positionName) && isEmpty(jobErrors.startYear) && isEmpty(jobErrors.endingYear) && isEmpty(jobErrors.currentlyWork)) {
      return true;
    } else {
      return false;
    }
  }

  const emptyJobValueCheck = () => {
    if (isEmpty(jobInfo.companyName) || isEmpty(jobInfo.positionName) || jobInfo.startYear === "" || (jobInfo.endingYear === "" && jobInfo.currentlyWork === false)) {
      let e = jobErrors;
      if (isEmpty(jobInfo.companyName)) {
        e = { ...e, companyName: "Required" };
      }
      if (isEmpty(jobInfo.positionName)) {
        e = { ...e, positionName: "Required" };
      }
      if (jobInfo.startYear === ""){
          e = { ...e, startYear: "Required", endingYear: "Required", currentlyWork: "Required" };
      }
      if (jobInfo.endingYear === "" && jobInfo.currentlyWork === false && new Date(jobInfo.startYear).toDateString() != new Date().toDateString()) {
        e = { ...e, currentlyWork: "Required", endingYear: "Required" };
        console.log('true')
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

  const [showJobForm, setShowJobForm] = useState(false)
  const [showEducationForm, setShowEducationForm] = useState(false)

  return (
    <>
      <VerticalTimeline>
        {props.user.timeline.map((experience: any) => {
          return (
            <>
              <VerticalTimelineElement
                key={experience._id}
                className="vertical-timeline-element--work"
                date={`${moment(experience.startYear).years().toString()} - ${experience.currentlyWork || experience.currentlyStudy ?
                  "Present" : moment(experience.endingYear).years().toString()}`}
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
              >
                <article
                  className="flex w-100 mt2 items-center"
                >
                  <div className="" style={{ minWidth: "35px", maxWidth: "35px" }}>
                    <img src={userProfilePic} />
                  </div>

                  <div className="ml2 bg-white w-100">
                    <div className="dib">

                      <h2 className="f6 fw3 mt0 mb0 tj">{experience.companyName ? experience.companyName : experience.degree}</h2>
                      <h3 className="f6 fw3 mt0 mb0 tj">{experience.positionName ? experience.positionName : experience.institutionName}</h3>
                    </div>
                    <Icon
                      className="fr mv3 tigrow-lightBlue pointer"
                      icon="edit"
                      onClick={() => {
                        if (experience.companyName) {
                          setShowJobForm(true);
                          setJobInfo({
                            _id: experience._id,
                            companyName: experience.companyName,
                            positionName: experience.positionName,
                            startYear: experience.startYear,
                            endingYear: experience.endingYear,
                            jobDescription: experience.jobDescription,
                            currentlyWork: experience.currentlyWork
                          })
                        } else if (experience.institutionName) {
                          setShowEducationForm(true);
                          setEducationInfo({
                            _id: experience._id,
                            degree: experience.degree,
                            institutionName: experience.degree,
                            startYear: experience.startYear,
                            endingYear: experience.endingYear,
                            eduDescription: experience.eduDescription,
                            currentlyStudy: experience.currentlyStudy,
                          })
                        }
                      }}
                    />
                  </div>
                </article>
                <p className="f6 fw3 mt0 mb0">{experience.jobDescription ? experience.jobDescription : experience.eduDescription}</p>
              </VerticalTimelineElement>
            </>
          )
        }
        )
        }
      </VerticalTimeline>
      {showJobForm && (
        <Dialog
          onClose={() => setShowJobForm(!showJobForm)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="ml4-ns ml3 mt4 mr2">
            <JobFormComponent
              checked={jobInfo.currentlyWork}
              handleCheck={handleWorkCheck}
              handleChange={handleJobChange}
              values={jobInfo}
              handleDateChange={handleJobDateChange}
              minEndYear={jobInfo.startYear === "" ? new Date() : new Date(jobInfo.startYear)}
              setShowDialog={setShowJobForm}
              emptyErrorCheck={emptyJobErrorCheck}
              emptyValueCheck={emptyJobValueCheck}
              errors={jobErrors}
            />
            <div className="fr mr4">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowJobForm(false);
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
                  if (!emptyJobValueCheck() && emptyJobErrorCheck()) {
                    const response = props.editJobExperienceAction(jobInfo, jobInfo._id);
                    if (response) {
                      setShowJobForm(false);
                    }
                  }
                }
                }
              >
                Save
    </Button>
            </div>
          </div>
        </Dialog>
      )}
      {showEducationForm && (
        <Dialog
          onClose={() => setShowEducationForm(!showEducationForm)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="ml4-ns ml3 mt4 mr2">
            <EducationFormComponent
              checked={educationInfo.currentlyStudy}
              handleCheck={handleEducationCheck}
              handleChange={handleEducationChange}
              values={educationInfo}
              handleDateChange={handleEducationDateChange}
              minEndYear={educationInfo.startYear === "" ? new Date() : new Date(educationInfo.startYear)}
              emptyErrorCheck={emptyEducationErrorCheck}
              emptyValueCheck={emptyEducationValueCheck}
              errors={educationErrors}
            />
            <div className="fr mr4">
              <Button className="w4 grow h2 pointer mr3"
                style={{ background: "#fff", outline: "none", border: "2px solid #0fa3a3", color: "#0fa3a3" }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowEducationForm(false);
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
                  if (!emptyEducationValueCheck() && emptyEducationErrorCheck()) {
                    const response = props.editEducationExperienceAction(educationInfo, educationInfo._id);
                    if (response) {
                      setShowEducationForm(false);
                    }
                  }
                }
                }
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
  }
}

export const ExperienceView = connect(mapStateToProps, { editJobExperienceAction, editEducationExperienceAction })(ExperienceViewComponent);