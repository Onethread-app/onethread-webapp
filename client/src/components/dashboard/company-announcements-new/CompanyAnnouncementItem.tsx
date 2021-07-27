import React from 'react';
import './CompanyAnnouncementsNew.scss';
import Linkify from 'react-linkify';
import { componentDecorator } from 'helpers/LinkifyHelper';
import icon from '../../../resources/images/icons/announcement.png';

const CompanyAnnouncementItem = (props) => {
  return (
    <div className="company-announcements-status mb2 flex pa3">
      <div className="icon">
        <img src={icon} alt="announcement" />
      </div>
      <div className="content-wrapper content-color pl3 pb2">
        <Linkify componentDecorator={componentDecorator}>
          {props.content}
        </Linkify>
        <div className="date secondary-font-color mt2">
          {props.date}
        </div>
      </div>
    </div>
  );
};

export default CompanyAnnouncementItem;
