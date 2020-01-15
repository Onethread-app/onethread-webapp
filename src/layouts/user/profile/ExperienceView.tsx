import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { connect } from 'react-redux';
import moment from 'moment';
import { Dialog, Icon, Divider } from '@blueprintjs/core';
import { JobForm } from './JobDetailsEditor';
import { EducationForm } from './EducationDetailsEditor';
import { editJobExperienceAction, editEducationExperienceAction } from 'stores/user/Actions';
import { User } from 'stores/user/Reducer';
import { ExperienceEditor } from './ExperienceEditor';

import JobIcon from './../../../resources/images/job.png';
import EducationIcon from './../../../resources/images/job.png';
import DefaultSkillImage from './../../../resources/images/skills.png';

interface ExperienceViewProps {
  user: User;
  editJobExperienceAction: (jobInfo: {}, id: string) => {};
  editEducationExperienceAction: (eduInfo: {}, id: string) => {};
}
const ExperienceViewComponent = (props: ExperienceViewProps) => {

  const [jobInfo, setJobInfo] = useState({
    _id: '',
    name: '',
    qualification: '',
    startYear: '',
    endingYear: '',
    currentStatus: false,
    description: ''
  });

  const [educationInfo, setEducationInfo] = useState({
    _id: '',
    name: '',
    qualification: '',
    startYear: '',
    endingYear: '',
    currentStatus: false,
    description: ''
  });

  const [showJobForm, setShowJobForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [addExperienceForm, setAddExperienceForm] = useState(false);

  return (
    <>
      <div className="br3 bg-white h-auto pa4 shadow-4">
        <div className="cf ">
          <h1 className="f5 lh-copy dib tigrow-lightGray-1">Experience</h1>
          <Icon
            className="fr mv3 tigrow-lightBlue pointer"
            icon="add"
            onClick={() => setAddExperienceForm(true)}
          />
        </div>
        <Divider />
        {props.user.timeline.length > 0 ?
          <VerticalTimeline>
            {props.user.timeline.map((experience: any) => {
              return (
                <>
                  <VerticalTimelineElement
                    key={experience._id}
                    className="vertical-timeline-element--work"
                    date={`${moment(experience.startYear).years().toString()} - ${experience.currentlyWork || experience.currentlyStudy ?
                      'Present' : moment(experience.endingYear).years().toString()}`}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                  >
                    <article
                      className="w-100 mt2"
                    >
                      <div className="flex items-center">
                        <div className="" style={{ minWidth: '35px', maxWidth: '35px' }}>
                          <img src={experience.companyName ? JobIcon : EducationIcon} />
                        </div>
                        <div>
                          <h2
                            className="f6 fw3 mt0 mb0 tj ml2"
                          >{experience.companyName ? experience.companyName : experience.degree}
                          </h2>
                        </div>
                      </div>
                      <div className="ml2 bg-white w-100">
                        <div className="flex justify-between">
                          <h3
                            className="f6 fw3 tj"
                          >
                            {experience.positionName ? experience.positionName : experience.institutionName}
                          </h3>
                          <Icon
                            className="fr mv3 tigrow-lightBlue pointer"
                            icon="edit"
                            onClick={() => {
                              if (experience.companyName) {
                                setShowJobForm(true);
                                setJobInfo({
                                  _id: experience._id,
                                  name: experience.companyName,
                                  qualification: experience.positionName,
                                  startYear: experience.startYear,
                                  endingYear: experience.endingYear,
                                  description: experience.jobDescription,
                                  currentStatus: experience.currentlyWork
                                });
                              } else if (experience.institutionName) {
                                setShowEducationForm(true);
                                setEducationInfo({
                                  _id: experience._id,
                                  name: experience.degree,
                                  qualification: experience.institutionName,
                                  startYear: experience.startYear,
                                  endingYear: experience.endingYear,
                                  description: experience.eduDescription,
                                  currentStatus: experience.currentlyStudy,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </article>
                    <p
                      className="f6 fw3 mt0 mb0 ws-break"
                    >
                      {experience.jobDescription ? experience.jobDescription : experience.eduDescription}
                    </p>
                  </VerticalTimelineElement>
                </>
              );
            }
            )
            }
          </VerticalTimeline>
          :
          <div className="br3 bg-white h-auto tc">
            <img src={DefaultSkillImage}></img>
            <p>No experience has added</p>
          </div>
        }
      </div>
      {showJobForm && (
        <Dialog
          onClose={() => setShowJobForm(!showJobForm)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div className="ml4-ns ml3 mt4 mr2">
            <JobForm
              setShowDialog={setShowJobForm}
              edit={true}
              values={jobInfo}
            />
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
            <EducationForm
              setShowDialog={setShowEducationForm}
              edit={true}
              values={educationInfo}
            />
          </div>
        </Dialog>
      )}
      {addExperienceForm && (
        <Dialog
          icon="briefcase"
          onClose={() => setAddExperienceForm(!addExperienceForm)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <ExperienceEditor setShowDialog={setAddExperienceForm} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const ExperienceView = connect(
  mapStateToProps,
  { editJobExperienceAction, editEducationExperienceAction }
)
  (ExperienceViewComponent);