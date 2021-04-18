import React from 'react';
import './CompanyAnnouncements.scss';
import Linkify from 'react-linkify';
import { componentDecorator } from 'helpers/LinkifyHelper';

const CompanyAnnouncements = (props) => {
  return (
    <div className="company-announcements-status mb2">
      <div className="info-wrapper flex justify-between items-center">
        <div className="heading primary-font-color">
          <h3>From {props.name.toUpperCase()}</h3>
        </div>
        <div className="date secondary-font-color">{props.date}</div>
      </div>
      <div className="content-wrapper content-color ml3 pb4 bb bw1 b--black-05 tj">
        <Linkify componentDecorator={componentDecorator}>
          {props.content}
        </Linkify>
      </div>
    </div>
  );
};

export default CompanyAnnouncements;
