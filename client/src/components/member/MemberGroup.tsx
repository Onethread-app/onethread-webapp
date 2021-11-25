import { Theme } from '@material-ui/core/styles/createTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Avatar from '@material-ui/core/Avatar/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup/AvatarGroup';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';

import { ITaskMember } from 'stores/task/Reducer';

import UserIcon from 'resources/images/profilePhoto.svg';

import MemberListDialog from './MemberListDialog';

import './Icon.scss';

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
      zIndex: 0,
    },
    large: {
      width: theme.spacing(5),
      height: theme.spacing(5),
      zIndex: 0,
    },
  }),
);

interface IMemberGroup {
  members: ITaskMember[];
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
              alt={`${member?.assignedPerson?.firstName}`}
              src={member?.assignedPerson?.profileImage ?? UserIcon}
              key={member?.assignedPerson?._id}
              className={props.small ? classes.small : classes.large}
            />
          ))}
        </AvatarGroup>
      }
    />
  );
};

export default MemberGroup;
