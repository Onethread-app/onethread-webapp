import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MobileView } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import { User } from 'stores/user/Reducer';

import Navbar from 'components/navbar/Navbar';
import { projectRules } from './settings/projectrules';
import { FileUpload } from './fileUpload';
import { ProjectOutlineView } from './ProjectOutlineView';
import { ProjectDescriptionView } from './ProjectDescriptionView';

import user from '../../../resources/images/profilePhoto.svg';
import DownloadIcon from '../../../resources/images/Download.svg';

interface ProjectPrefaceProps {
  description: string;
  outline: string;
  files: any;
  role: string;
  optionalRole: any;
  projectMembers: any;
  project: any;
  company: any;
  user: User;
}

export const ProjectPrefaceViewComponent = (
  props: ProjectPrefaceProps,
) => {
  const { t } = useTranslation();
  const [showFileDialog, setShowFileDialog] = useState(false);
  const permissions = projectRules(props.role, props.optionalRole);
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <>
      <MobileView>
        <Navbar type='company' />
        <div className='flex justify-between mt5'>
          <NavLink
            exact
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
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
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
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
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
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
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
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
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
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
            className='bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25'
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
      <h1 className='f3 ph5-ns ph4'>
        {t('app.project.Project-preface.Intro')}
      </h1>
      <div className='flex-ns w-100 ph4-ns'>
        <div className='h-auto w-70-ns ph4'>
          <div className='w-90-ns'>
            <ProjectDescriptionView
              headline={t('app.project.Project-preface.Details')}
              description={props.description}
            />
            <ProjectOutlineView
              projectOutline={props.outline}
              headline={t('app.project.Project-preface.Outline')}
            />
          </div>
        </div>
        <div className='w-30-ns pa4 pb5'>
          <div>
            <h1 className='f6'>
              {t('app.project.Project-preface.Media')}
            </h1>
            {props.files.map((file: any) => (
              <div className='flex items-center justify-between'>
                <h1
                  className='f6 fw6 blue w-80'
                  style={{
                    wordBreak: 'break-word',
                    wordWrap: 'break-word',
                  }}
                >
                  {file.s3Key.split('/')[1]}
                </h1>
                <a
                  href={file.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  download
                >
                  <span className='flex pl3'>
                    <img
                      src={DownloadIcon}
                      alt='Download icon'
                      style={{
                        width: '23px',
                        height: '23px',
                      }}
                    />
                  </span>
                </a>
              </div>
            ))}
            {(permissions.grantAll
              || (permissions.projectModerator
                && permissions.projectModerator.includes(
                  'addFileProject',
                ))) && (
                <Button
                  className='pointer w4 pa2 flex flex-column center mb5 mt4'
                  style={{
                    background: '#fff',
                    outline: 'none',
                    border: '2px solid blue',
                    color: 'blue',
                  }}
                  onClick={() => setShowFileDialog(true)}
                >
                  {t('app.project.Project-preface.Upload')}
                </Button>
            )}
          </div>

          <h1 className='f6 pb2'>
            {t('app.project.Project-preface.Team')}
            {' '}
            (
            {props.projectMembers && props.projectMembers.length}
            )
          </h1>
          {props.projectMembers
            && props.projectMembers.map((member: any) => (
              <div>
                <article className='pv2'>
                  <div className='dtc v-mid'>
                    <img
                      src={
                        member.account.profileImage
                          ? member.account.profileImage
                          : user
                      }
                      className='db ba b--black-10 br2'
                      style={{ width: '45px', height: '45px' }}
                      alt=''
                    />
                  </div>
                  <div className='dtc v-mid pl3'>
                    <h1 className='f6 fw6 black mv0'>
                      {member.account.name}
                    </h1>
                    <h1 className='f7 fw4 black mv1'>
                      {member.role === 'projectModerator'
                        ? `${t(
                          'app.project.Project-settings.Moderator',
                        )}`
                        : capitalizeFirstLetter(member.role)}
                    </h1>
                  </div>
                </article>
              </div>
            ))}
        </div>
      </div>
      {showFileDialog && (
        <Dialog
          icon='briefcase'
          onClose={() => setShowFileDialog(!showFileDialog)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <FileUpload setShowDialog={setShowFileDialog} />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  description: state.projectReducer.projectDetails.description,
  outline: state.projectReducer.projectDetails.outline,
  files: state.projectReducer.projectDetails.files,
  role:
    state.projectReducer.projectRole
    && state.projectReducer.projectRole.projects
    && state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole
    && state.projectReducer.projectRole.projects
    && state.projectReducer.projectRole.projects.project
    && state.projectReducer.projectRole.projects.project.optionalRole,
  projectMembers: state.projectReducer.projectDetails.members,
  project: state.projectReducer.projectDetails,
  company: state.companyReducer.currentCompany,
  user: state.userReducer.user,
});

export const ProjectPrefaceView = connect(
  mapStateToProps,
  null,
)(ProjectPrefaceViewComponent);

export default ProjectPrefaceView;
