import * as React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { ListItemViewWithDetails } from 'components/common/ListItemViewWithDetails';
import user from '../../../../resources/images/user.png';

export const ExperienceView = () => {
  return (
    <VerticalTimeline>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="2010 - 2011"
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      >
        <ListItemViewWithDetails
          imageSrc={user}
          listTitle="TiGrow"
          listSubtitle="Software Engineer"
          listDescription="Creative Direction, User Experience, Visual Design, Project Management, Team Leading"
        />

      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="2010 - 2011"
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      >
        <ListItemViewWithDetails
          imageSrc={user}
          listTitle="TiGrow"
          listSubtitle="Software Engineer"
          listDescription="Creative Direction, User Experience, Visual Design, Project Management, Team Leading"
        />

      </VerticalTimelineElement>
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="2010 - 2011"
        iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
      >
        <ListItemViewWithDetails
          imageSrc={user}
          listTitle="TiGrow"
          listSubtitle="Software Engineer"
          listDescription="Creative Direction, User Experience, Visual Design, Project Management, Team Leading"
        />

      </VerticalTimelineElement>
    </VerticalTimeline>

  )
}