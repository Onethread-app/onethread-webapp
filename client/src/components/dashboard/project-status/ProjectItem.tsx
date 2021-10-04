import { useState } from 'react';
import moment from 'moment';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import StatusTag from 'components/project/StatusTag';
import MemberIcon from 'components/member/MemberIcon';
import MembersList from './MembersList';

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[
          theme.palette.type === 'light' ? 200 : 700
        ],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  }),
)(LinearProgress);

interface IProjectItem {
  project: any;
  index: number;
}

const ProjectItem = (props: IProjectItem) => {
  const [showAllMembers, setShowAllMembers] = useState(false);

  const { name, status, deadline, members, doneTask, taskNumbers } =
    props.project;

  return (
    <>
      <div className="project-item flex items-center w-100">
        <div className="project-item-no">
          <h3 className="f5-ns f6 fw5">
            {('0' + (props.index + 1)).slice(-2)}
          </h3>
        </div>
        <div className="project-item-name">
          <h3 className="f5-ns f6 fw5">{name}</h3>
        </div>
        <div className="project-item-members flex items-center justify-center">
          {members.length > 0 &&
            members
              .slice(0, 2)
              .map((member: any) => (
                <MemberIcon
                  name={`${member.member!.account!.firstName} ${
                    member.member!.account!.lastName
                  }`}
                  _id={member.member!.account!._id}
                  profileImage={member.member!.account!.profileImage}
                  key={member.member!.account!._id}
                />
              ))}
          {members.length > 2 && (
            <MoreHorizIcon
              className="pointer"
              onClick={() => setShowAllMembers(true)}
            />
          )}
        </div>
        <div className="project-item-status">
          <h3 className="f5-ns f6 fw5">
            <StatusTag status={status} />
          </h3>
        </div>
        <div className="project-item-deadline">
          <h3 className="f5-ns f6 fw5">
            {deadline
              ? moment(deadline).format('DD/MM/YYYY')
              : 'Not Set'}
          </h3>
        </div>
        <div className="project-item-task">
          <h3 className="f5-ns f6 fw5 flex items-center">
            <div className="w-80">
              <BorderLinearProgress
                variant="determinate"
                value={taskNumbers / doneTask}
              />
            </div>
            <span className="w-20">{`${
              taskNumbers - doneTask
            } / ${taskNumbers}`}</span>
          </h3>
        </div>
      </div>
      {showAllMembers && (
        <Dialog
          isOpen={showAllMembers}
          onClose={() => {
            setShowAllMembers(false);
          }}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="w-50"
        >
          <MembersList
            members={members}
            setShowAllMembers={setShowAllMembers}
          />
        </Dialog>
      )}
    </>
  );
};

export default ProjectItem;
