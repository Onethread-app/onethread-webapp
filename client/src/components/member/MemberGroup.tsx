import React from 'react';

import {
  makeStyles,
  createStyles,
  Theme,
} from '@material-ui/core/styles';
import AvatarGroup from '@material-ui/lab/AvatarGroup/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';
import { Popover } from '@blueprintjs/core';

import MemberListDialog from './MemberListDialog';
import UserIcon from 'resources/images/profilePhoto.svg';

import { IBoardMember, ITaskMember } from 'stores/board/Reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  }),
);

interface IMemberGroup {
  members: IBoardMember[] | ITaskMember[];
  small?: boolean;
}

const MemberGroup = (props: IMemberGroup) => {
  const classes = useStyles();
  return (
    <Popover
      content={<MemberListDialog members={props.members} />}
      interactionKind="hover"
      target={
        <AvatarGroup max={3} className="pointer">
          {props.members.map((member) => (
            <Avatar
              alt={`${member.name}`}
              src={member.profileImage ?? UserIcon}
              key={member._id}
              className={props.small ? classes.small : classes.large}
            />
          ))}
        </AvatarGroup>
      }
    />
  );
};

export default MemberGroup;
