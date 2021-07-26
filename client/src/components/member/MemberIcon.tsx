import React from 'react';

import { Popover } from '@blueprintjs/core';

import UserIcon from 'resources/images/profilePhoto.svg';

interface IMemberIcon {
  _id?: string;
  name: string;
  profileImage: string;
}

const MemberIcon = (props: IMemberIcon) => {
  return (
    <div className="flex items-center ma1">
      <Popover
        position="top"
        interactionKind="hover"
        popoverClassName="bg-blue br2"
        content={
          <h4 className="ttc pa1 bg-blue white br2">{props.name}</h4>
        }
        target={
          <img
            src={props.profileImage ?? UserIcon}
            alt={props.profileImage ?? props.name}
            style={{
              width: '27px',
              height: '27px',
              borderRadius: '50%',
            }}
          />
        }
      />
    </div>
  );
};

export default MemberIcon;
