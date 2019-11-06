import * as React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { ListItemViewWithDetails } from 'components/common/ListItemViewWithDetails';
import user from '../../../../resources/images/user.png';
import { connect } from 'react-redux';
import moment from 'moment';

const ExperienceViewComponent = (props: any) => {
  return (
    <VerticalTimeline>
      {props.user.timeline.map((ex: any) => {
        let startYear = moment(ex.startYear).years().toString();
        let endingYear = ex.currentlyWork || ex.currentlyStudy ? "Present" : moment(ex.endingYear).years().toString();
        let companyName = ex.companyName;
        let positionName = ex.positionName;
        let institutionName = ex.institutionName;
        let degree = ex.degree;
        return (
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date={`${startYear} - ${endingYear}`}
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <ListItemViewWithDetails
              imageSrc={user}
              listTitle={companyName ? companyName : degree}
              listSubtitle={positionName ? positionName : institutionName}
              listDescription="Creative Direction, User Experience, Visual Design, Project Management, Team Leading"
            />
          </VerticalTimelineElement>
        )
      })}
    </VerticalTimeline>
  )
}

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  }
}

export const ExperienceView = connect(mapStateToProps, {})(ExperienceViewComponent);