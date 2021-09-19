import { useState } from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import { connect } from 'react-redux';

import moment from 'moment';

import { User } from 'stores/user/Reducer';
import {
  editJobExperienceAction,
  editEducationExperienceAction,
} from 'stores/user/Actions';

import JobIcon from './../../../resources/images/job.png';
import EducationIcon from './../../../resources/images/education.png';
import DefaultSkillImage from './../../../resources/images/skills.png';
import editIcon from './../../../resources/images/editIcon.png';
import addIcon from './../../../resources/images/addIcon.png';

import { JobForm } from './JobDetailsEditor';
import { EducationForm } from './EducationDetailsEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { RightSidebar } from 'components/RightSidebar';

import 'react-vertical-timeline-component/style.min.css';

interface IExperienceViewProps {
  user: User;
  editJobExperienceAction: (jobInfo: {}, id: string) => {};
  editEducationExperienceAction: (eduInfo: {}, id: string) => {};
}
const ExperienceViewComponent = (props: IExperienceViewProps) => {
  const [jobInfo, setJobInfo] = useState({
    _id: '',
    name: '',
    qualification: '',
    startYear: '',
    endingYear: '',
    currentStatus: false,
    description: '',
  });

  const [educationInfo, setEducationInfo] = useState({
    _id: '',
    name: '',
    qualification: '',
    startYear: '',
    endingYear: '',
    currentStatus: false,
    description: '',
  });

  const [showJobForm, setShowJobForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [addExperienceForm, setAddExperienceForm] = useState(false);

  return (
    <>
      {props.user.timeline.length > 0 ? (
        <VerticalTimeline>
          {props.user.timeline.map((experience: any) => {
            return (
              <>
                <VerticalTimelineElement
                  key={experience._id}
                  className="vertical-timeline-element--work"
                  date={`${moment(experience.startYear)
                    .years()
                    .toString()} - ${
                    experience.currentlyWork ||
                    experience.currentlyStudy
                      ? 'Present'
                      : moment(experience.endingYear)
                          .years()
                          .toString()
                  }`}
                  iconStyle={{
                    background: 'rgb(33, 150, 243)',
                    color: '#fff',
                  }}
                >
                  <article className="w-100 mt2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div style={{ minWidth: '30px' }}>
                          <img
                            style={{ width: '30px' }}
                            src={
                              experience.companyName
                                ? JobIcon
                                : EducationIcon
                            }
                          />
                        </div>
                        <div className="ml2">
                          <h1 className="f5 fw7 mt0 mb0 black-70 ws-break">
                            {experience.companyName
                              ? experience.companyName
                              : experience.degree}
                          </h1>
                          <h1 className="f5 fw2 mv1 ws-break">
                            {experience.positionName
                              ? experience.positionName
                              : experience.institutionName}
                          </h1>
                        </div>
                      </div>
                      <div
                        className="mh1 pointer"
                        style={{ minWidth: '30px' }}
                      >
                        <img
                          className="tigrow-lightBlue pointer"
                          style={{ width: '30px' }}
                          src={editIcon}
                          onClick={() => {
                            if (experience.companyName) {
                              setShowJobForm(true);
                              setJobInfo({
                                _id: experience._id,
                                name: experience.companyName,
                                qualification:
                                  experience.positionName,
                                startYear: experience.startYear,
                                endingYear: experience.endingYear,
                                description:
                                  experience.jobDescription,
                                currentStatus:
                                  experience.currentlyWork,
                              });
                            } else if (experience.institutionName) {
                              setShowEducationForm(true);
                              setEducationInfo({
                                _id: experience._id,
                                name: experience.degree,
                                qualification:
                                  experience.institutionName,
                                startYear: experience.startYear,
                                endingYear: experience.endingYear,
                                description:
                                  experience.eduDescription,
                                currentStatus:
                                  experience.currentlyStudy,
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml2 bg-white w-100">
                      <div className="flex justify-between"></div>
                    </div>
                  </article>
                  <p className="mt0 mb0 ws-break">
                    {experience.jobDescription
                      ? experience.jobDescription
                      : experience.eduDescription}
                  </p>
                </VerticalTimelineElement>
              </>
            );
          })}
        </VerticalTimeline>
      ) : (
        <div className="br3 bg-white h-auto tc">
          <img src={DefaultSkillImage}></img>
          <p>No experience has added</p>
        </div>
      )}
      <div>
        <img
          className="fixed pointer addButton"
          style={{
            boxShadow: '0px 6px 6px #00000029',
            borderRadius: '50%',
          }}
          onClick={() => setAddExperienceForm(true)}
          src={addIcon}
        />
      </div>
      {showJobForm && (
        <RightSidebar onClose={() => setShowJobForm(!showJobForm)}>
          <div className="mh2 mt4">
            <JobForm
              setShowDialog={setShowJobForm}
              edit={true}
              values={jobInfo}
            />
          </div>
        </RightSidebar>
      )}
      {showEducationForm && (
        <RightSidebar
          onClose={() => setShowEducationForm(!showEducationForm)}
        >
          <div className="mh2 mt4">
            <EducationForm
              setShowDialog={setShowEducationForm}
              edit={true}
              values={educationInfo}
            />
          </div>
        </RightSidebar>
      )}
      {addExperienceForm && (
        <RightSidebar
          onClose={() => setAddExperienceForm(!addExperienceForm)}
        >
          <div>
            <ExperienceEditor setShowDialog={setAddExperienceForm} />
          </div>
        </RightSidebar>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const ExperienceView = connect(mapStateToProps, {
  editJobExperienceAction,
  editEducationExperienceAction,
})(ExperienceViewComponent);
