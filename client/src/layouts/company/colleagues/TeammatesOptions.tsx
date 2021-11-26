import { isEmpty, isEqual } from 'lodash';
import { connect } from 'react-redux';

import { Alignment, Button, ButtonGroup } from '@blueprintjs/core';
import {
  changeProjectMemberRole,
  deleteTeamMember,
} from 'stores/project/Actions';

interface Props {
  row: any;
  projectRole: string;
  companyRole: string;
  userId: string;
  changeProjectMemberRole: (
    { role: string },
    memberId: string,
    memberAccountId: string,
  ) => void;
  deleteTeamMember: (memberId: string) => void;
}

const TeammatesOptions = (props: Props) => {
  const { row, userId } = props;
  return (
    <>
      {row.role === 'admin' ? (
        <>
          {isEqual(props.companyRole, 'superAdmin') ||
          (!isEmpty(props.projectRole) &&
            isEqual(props.projectRole, 'admin')) ? (
            <ButtonGroup
              alignText={Alignment.LEFT}
              className="bp3-minimal bp3-vertical bp3-fill"
            >
              <Button
                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                style={{ color: 'red' }}
                onClick={async () => {
                  await props.changeProjectMemberRole(
                    {
                      role: 'projectModerator',
                    },
                    row.member._id,
                    row.member.account._id,
                  );
                }}
              >
                <span>Remove from Admin</span>
              </Button>
              {userId !== row.accountId && (
                <Button
                  className="outline-0 bp3-large bp3-popover-dismiss"
                  onClick={async () => {
                    await props.deleteTeamMember(row.id);
                  }}
                >
                  <span className="red">Remove Member</span>
                </Button>
              )}
            </ButtonGroup>
          ) : null}
        </>
      ) : row.role === 'projectModerator' ? (
        <>
          {isEqual(props.companyRole, 'superAdmin') ||
          (!isEmpty(props.projectRole) &&
            isEqual(props.projectRole, 'admin')) ? (
            <ButtonGroup
              alignText={Alignment.LEFT}
              className="bp3-minimal bp3-vertical bp3-fill"
            >
              <Button
                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                onClick={async () => {
                  await props.changeProjectMemberRole(
                    { role: 'admin' },
                    row.member._id,
                    row.member.account._id,
                  );
                }}
              >
                <span>Make Admin</span>
              </Button>
              <Button
                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                style={{ color: 'red' }}
                onClick={async () => {
                  await props.changeProjectMemberRole(
                    { role: 'member' },
                    row.member._id,
                    row.member.account._id,
                  );
                }}
              >
                <span>Remove from Moderator</span>
              </Button>

              <Button
                className="outline-0 bp3-large bp3-popover-dismiss"
                onClick={async () => {
                  await props.deleteTeamMember(row.id);
                }}
              >
                <span className="red">Remove Member</span>
              </Button>
            </ButtonGroup>
          ) : null}
        </>
      ) : (
        <>
          {isEqual(props.companyRole, 'superAdmin') ||
          (!isEmpty(props.projectRole) &&
            isEqual(props.projectRole, 'admin')) ? (
            <ButtonGroup
              alignText={Alignment.LEFT}
              className="bp3-minimal bp3-vertical bp3-fill"
            >
              <Button
                className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                onClick={async () => {
                  await props.changeProjectMemberRole(
                    {
                      role: 'projectModerator',
                    },
                    row.member._id,
                    row.member.account._id,
                  );
                }}
              >
                <span>Make Moderator</span>
              </Button>

              <Button
                className="outline-0 bp3-large bp3-popover-dismiss"
                onClick={async () => {
                  props.deleteTeamMember(row.id);
                }}
              >
                <span className="red">Remove Member</span>
              </Button>
            </ButtonGroup>
          ) : null}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  userId: state.userReducer.user._id,
  teams: state.projectReducer.teams,
  projectRole:
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.role,
  companyRole: state.companyReducer.currentCompany.role,
});

export default connect(mapStateToProps, {
  changeProjectMemberRole,
  deleteTeamMember,
})(TeammatesOptions);
