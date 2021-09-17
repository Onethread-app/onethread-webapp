import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { MobileView, isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { IProjectTeam } from 'stores/project/Reducer';
import { Associate } from 'stores/associate/Reducer';
import {
  getProjectTeams,
  changeProjectMemberRole,
  deleteTeamMember,
} from 'stores/project/Actions';

import {
  getDivisionName,
  showDepartment,
} from 'layouts/company/colleagues/Index';
import Navbar from 'components/navbar/Navbar';
import MemberTable from '../../../../components/MemberTable/MemberTable';
import SearchOption from 'components/SearchOption/SearchOption';
import { AddProjectMemberForm } from './AddProjectMemberForm';
import { AddProjectAssociateForm } from './AddProjectAssociateForm';
import { AssociateList } from './AssociateList';

import './Index.scss';

interface TeamMember {
  company: ICompany;
  user: User;
  teams: IProjectTeam[];
  associates: Associate[];
  companyRole: string;
  projectRole: string;
  list: IProjectTeam[];
  getProjectTeams: () => void;
  changeProjectMemberRole: (
    values: { role: string },
    memberId: string,
    accountId: string,
  ) => void;
  deleteTeamMember: (teamId: string) => void;
  project: any;
  projectList: Array<{ _id: string; company: string }>;
}

const ProjectTeamPageComponent = (props: TeamMember) => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const [showAssociateDialog, setShowAssociateDialog] = useState(
    false,
  );
  const [teammatesList, setTeammatesList] = useState<any[]>([]);
  const [rows, setRows] = React.useState<any[]>(teammatesList);

  useEffect(() => {
    setRows(teammatesList);
  }, [teammatesList]);

  useEffect(() => {
    if (props.project._id) {
      props.getProjectTeams();
    }
  }, [props.project._id]);

  useEffect(() => {
    let teammatesList = props.teams.map((m: any, i) => ({
      name: `${upperFirst(
        m.member.account.firstName,
      )}${' '}${upperFirst(m.member.account.lastName)}`,
      email: m.member.account.email,
      profileImage: m.member.account.profileImage
        ? m.member.account.profileImage
        : null,
      division: `${
        m.member.designations.length > 0 &&
        getDivisionName[m.member.designations[0].division]
      }`,
      department: `${showDepartment(m.member)}`,
      position: `${
        m.member.designations.length > 0 &&
        m.member.designations[0].position
      }`,
      role: m.role,
      id: m._id,
      accountId: m.member.account._id,
      member: m.member,
    }));
    setTeammatesList(teammatesList);
  }, [props.teams]);

  return (
    <>
      <MobileView>
        <Navbar type="company" />
        <div className="flex justify-between mt5">
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/overview`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.company.Projects.Overview')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-preface.Intro')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/room`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-rooms.Rooms')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/board`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-boards.Board')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/team`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-teammates.Team-members')}
            </small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/settings`}
            activeStyle={{
              background: '#34b3e9',
              color: 'white',
            }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.company.Projects.Project-Settings')}
            </small>
          </NavLink>
        </div>
      </MobileView>
      <div
        className="ph5-ns ph3 pv4"
        style={{ background: '#E5E5E5' }}
      >
        <div
          className="flex justify-between items-center"
          style={{ borderBottom: '2px solid #E0E0E0' }}
        >
          {isMobileOnly ? undefined : (
            <h1 className="f3">
              {t('app.project.Project-teammates.Team-members')} (
              {teammatesList.length})
            </h1>
          )}
          <div className="teammates-top-area mb1">
            <SearchOption
              list={teammatesList}
              rows={rows}
              setRows={setRows}
            />
            <Button
              className="grow fr h2 pointer white bp3-minimal mr2 ml2 mb1"
              style={{
                background: '#34b3e9',
                color: '#fff',
                outline: 'none',
              }}
              onClick={() => setShowDialog(!showDialog)}
            >
              {t('app.project.Project-teammates.Add-Teammates')}
            </Button>
            {props.projectList &&
              props.projectList.map((project) =>
                props.project._id === project._id ? (
                  project.company === props.company._id ? (
                    <Button
                      className="grow fr h2 pointer white bp3-minimal mr2 mb1"
                      style={{
                        background: '#34b3e9',
                        color: '#fff',
                        outline: 'none',
                      }}
                      onClick={() =>
                        setShowAssociateDialog(!showAssociateDialog)
                      }
                    >
                      {t('app.company.Partners.Add-Partners')}
                      {/* Add Partners */}
                    </Button>
                  ) : undefined
                ) : undefined,
              )}
          </div>
        </div>

        {/* new table */}
        <MemberTable type={'teammates'} rows={rows} props={props} />
        {/* new table */}

        <h1 className="f4 mv4">
          {t('app.company.Partners.External')}
        </h1>
        <AssociateList />
      </div>

      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <AddProjectMemberForm
            showDialog={showDialog}
            setShowDialog={(e) => setShowDialog(!showDialog)}
          />
        </Dialog>
      )}

      {showAssociateDialog && (
        <Dialog
          onClose={() => setShowAssociateDialog(!showAssociateDialog)}
          isOpen={showAssociateDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <AddProjectAssociateForm
            showDialog={showAssociateDialog}
            setShowDialog={(e) =>
              setShowAssociateDialog(!showAssociateDialog)
            }
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    teams: state.projectReducer.teams,
    projectRole:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.role,
    companyRole: state.companyReducer.currentCompany.role,
    project: state.projectReducer.projectDetails,
    company: state.companyReducer.currentCompany,
    projectList: state.projectReducer.allProjects,
  };
};

export const ProjectTeamPage = connect(mapStateToProps, {
  getProjectTeams,
  changeProjectMemberRole,
  deleteTeamMember,
})(ProjectTeamPageComponent);

export default ProjectTeamPage;
