import * as React from 'react';
import { ProjectDescriptionView } from './ProjectDescriptionView';
import DownloadIcon from './../../../resources/images/Download.svg';
import { Button, Dialog } from '@blueprintjs/core';
import user from '../../../resources/images/profilePhoto.svg';
import { useState } from 'react';
import { FileUpload } from './fileUpload';
import { connect } from 'react-redux';
import { ProjectOutlineView } from './ProjectOutlineView';
import { projectRules } from './settings/projectrules';
import { NavLink } from 'react-router-dom';
import { MobileView } from 'react-device-detect';
import { User } from 'stores/user/Reducer';
import { NavbarCompany } from 'components/NavbarCompany';

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
  const [showFileDialog, setShowFileDialog] = useState(false);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <MobileView>
        <NavbarCompany title="Project" />
        <div className="flex justify-between mt5">
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Preface</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/room`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Room</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/board`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Board</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/team`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Team</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/settings`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Settings</small>
          </NavLink>
        </div>
      </MobileView>
      <h1 className="f3 ph5-ns ph4">Preface</h1>
      <div className="flex-ns w-100 ph4-ns">
        <div className="h-auto w-70-ns ph4">
          <div className="w-90-ns">
            <ProjectDescriptionView
              headline={'Project Description'}
              description={props.description}
            />
            <ProjectOutlineView
              projectOutline={props.outline}
              headline={'Project Outline'}
            />
          </div>
        </div>
        <div className="w-30-ns pa4 pb5">
          {props.role === 'admin' ? (
            <div>
              <h1 className="f6">Shared Files</h1>
              {props.files.map((file: any) => (
                <div className="flex items-center justify-between">
                  <h1 className="f6 fw6 blue w-80" style={{wordBreak: 'break-word', wordWrap: 'break-word'}}>
                    {file.s3Key.split('/')[1]}
                  </h1>
                  <a
                    href={file.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <span className="flex pl3">
                      <img
                        src={DownloadIcon}
                        alt="Download icon"
                        style={{
                          width: '23px',
                          height: '23px',
                        }}
                      />
                    </span>
                  </a>
                </div>
              ))}
              <Button
                className="pointer w4 pa2 flex flex-column center mb5 mt4"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '2px solid blue',
                  color: 'blue',
                }}
                onClick={() => setShowFileDialog(true)}
              >
                Upload Files
              </Button>
            </div>
          ) : (
            props.optionalRole &&
            props.role &&
            projectRules(props.optionalRole)[props.role].includes(
              'addFileProject',
            ) && (
              <div>
                <h1 className="f6">Shared Files</h1>
                {props.files.map((file: any) => (
                  <div className="flex items-center justify-between">
                    <h1 className="f6 fw6 blue w-80" style={{wordBreak: 'break-word', wordWrap: 'break-word'}} >
                      {file.s3Key.split('/')[1]}
                    </h1>
                    <a
                      href={file.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <span className="flex pl3">
                        <img
                          src={DownloadIcon}
                          alt="Download icon"
                          style={{
                            width: '23px',
                            height: '23px',
                          }}
                        />
                      </span>
                    </a>
                  </div>
                ))}
                <Button
                  className="pointer w4 pa2 flex flex-column center mb5 mt4"
                  style={{
                    background: '#fff',
                    outline: 'none',
                    border: '2px solid blue',
                    color: 'blue',
                  }}
                  onClick={() => setShowFileDialog(true)}
                >
                  Upload Files
                </Button>
              </div>
            )
          )}
          <h1 className="f6 pb2">
            Project Members (
            {props.projectMembers && props.projectMembers.length})
          </h1>
          {props.projectMembers &&
            props.projectMembers.map((member: any) => (
              <div>
                <article className="pv2">
                  <div className="dtc v-mid">
                    <img
                      src={user}
                      className="db br-100 ba b--black-10"
                      style={{ width: '45px', height: '45px' }}
                    />
                  </div>
                  <div className="dtc v-mid pl3">
                    <h1 className="f6 fw6 black mv0">
                      {member.account.name}
                    </h1>
                    <h1 className="f7 fw4 black mv1">
                      {member.role === 'projectModerator'
                        ? 'Project Moderator'
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
          icon="briefcase"
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
    state.projectReducer.projectRole &&
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole &&
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project &&
    state.projectReducer.projectRole.projects.project.optionalRole,
  projectMembers: state.projectReducer.projectDetails.members,
  project: state.projectReducer.projectDetails,
  company: state.companyReducer.currentCompany,
  user: state.userReducer.user,
});

export const ProjectPrefaceView = connect(
  mapStateToProps,
  null,
)(ProjectPrefaceViewComponent);
