import Linkify from 'react-linkify';
import { upperFirst } from 'lodash';

import icon from 'resources/images/icons/announcement.png';

import { componentDecorator } from 'helpers/LinkifyHelper';

import './CompanyAnnouncementsNew.scss';

const CompanyAnnouncementItem = (props) => {
  return (
    <div className="company-announcements-status mb2 flex pa3">
      <div className="icon pt1">
        <img src={icon} alt="announcement" />
      </div>
      <div className="content-wrapper content-color pl3 pb1">
        <div className="heading mb1">
          {props.divison === props.position ? (
            <h3>
              From {upperFirst(props.firstName)}{' '}
              {upperFirst(props.lastName)} - {props.divison}
            </h3>
          ) : (
            <h3>
              From {upperFirst(props.firstName)}{' '}
              {upperFirst(props.lastName)} - {props.divison} -{' '}
              {props.position}
            </h3>
          )}
        </div>
        <Linkify componentDecorator={componentDecorator}>
          <p>{props.content}</p>
        </Linkify>
        <div className="date secondary-font-color mt2">
          <span>{props.date}</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyAnnouncementItem;
