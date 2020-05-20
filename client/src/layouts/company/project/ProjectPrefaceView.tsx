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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { NavbarCompany } from 'components/NavbarCompany';
=======
import { MobileListView } from '../MobileListView';
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
import { MobileListView } from '../MobileListView';
>>>>>>> 05623007... mobile responsive for project preface
=======
import { NavbarCompany } from 'components/NavbarCompany';
>>>>>>> 2650e2be... Feature/mobile responsive (#148)

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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
=======
  const [showDialog, setShowDialog] = useState(false);
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
  const [showDialog, setShowDialog] = useState(false);
>>>>>>> 05623007... mobile responsive for project preface
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)

  return (
    <>
      <MobileView>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <NavbarCompany title="Project" />
=======
        <Navbar fixedToTop className="flex justify-between items-center shadow-4" style={{ height: '55px' }}>
=======
=======
>>>>>>> 4e99f05f... code style issue fixed
        <Navbar
          fixedToTop
          className="flex justify-between items-center shadow-4"
          style={{ height: '55px' }}
        >
<<<<<<< HEAD
>>>>>>> d06346b0... code style issue fixed
          <h1 className="f3">My Projects</h1>
          <img
            src={
              props.user.profileImage ? props.user.profileImage : user
=======
        <Navbar fixedToTop className="flex justify-between items-center shadow-4" style={{ height: '55px' }}>
          <h1 className="f3">My Projects</h1>
          <img
            src={
              props.user.profileImage
                ? props.user.profileImage
                : user
>>>>>>> 05623007... mobile responsive for project preface
=======
          <h1 className="f3">My Projects</h1>
          <img
            src={
              props.user.profileImage ? props.user.profileImage : user
>>>>>>> 4e99f05f... code style issue fixed
            }
            className="dim v-mid dib br-100 pointer"
            style={{
              width: '2rem',
              height: '2rem',
              objectFit: 'cover',
            }}
            alt="user"
            onClick={() => setShowDialog(true)}
<<<<<<< HEAD
<<<<<<< HEAD
          />
        </Navbar>
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
        <NavbarCompany title="Project" />
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======

=======
>>>>>>> 4e99f05f... code style issue fixed
          />
        </Navbar>
>>>>>>> 05623007... mobile responsive for project preface
=======
        <NavbarCompany title="Project" />
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="w-30-ns pa4 pb5">
=======
        <div className="w-30-ns pa4">
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
        <div className="w-30-ns pa4 pb5">
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
        <div className="w-30-ns pa4">
>>>>>>> 05623007... mobile responsive for project preface
=======
        <div className="w-30-ns pa4 pb5">
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
          {props.role === 'admin' ? (
            <div>
              <h1 className="f6">Shared Files</h1>
              {props.files.map((file: any) => (
                <div className="flex items-center justify-between">
                  <h1 className="f6 fw6 blue">
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            props.optionalRole &&
            props.role &&
=======
>>>>>>> d06346b0... code style issue fixed
=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
=======
>>>>>>> 4e99f05f... code style issue fixed
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
            projectRules(props.optionalRole)[props.role].includes(
              'addFileProject',
            ) && (
              <div>
                <h1 className="f6">Shared Files</h1>
                {props.files.map((file: any) => (
                  <div className="flex items-center justify-between">
                    <h1 className="f6 fw6 blue">
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
>>>>>>> 05623007... mobile responsive for project preface
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
              projectRules(props.optionalRole)[props.role].includes(
                'addFileProject',
              ) && (
                <div>
                  <h1 className="f6">Shared Files</h1>
                  {props.files.map((file: any) => (
                    <div className="flex items-center justify-between">
                      <h1 className="f6 fw6 blue">
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
>>>>>>> d06346b0... code style issue fixed
=======
>>>>>>> a51ad486... Feature/mobile responsive (#148)
=======
>>>>>>> 750029e8... Release/v2.2.0 (#183)
=======
>>>>>>> 05623007... mobile responsive for project preface
=======
>>>>>>> 4e99f05f... code style issue fixed
=======
>>>>>>> 2650e2be... Feature/mobile responsive (#148)
=======
>>>>>>> a26cd117... Release/v2.2.0 (#183)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  user: state.userReducer.user,
=======
  user: state.userReducer.user
>>>>>>> b9e80fb9... mobile responsive for project preface
=======
  user: state.userReducer.user,
>>>>>>> d06346b0... code style issue fixed
=======
  user: state.userReducer.user
>>>>>>> 05623007... mobile responsive for project preface
=======
  user: state.userReducer.user,
>>>>>>> 4e99f05f... code style issue fixed
});

export const ProjectPrefaceView = connect(
  mapStateToProps,
  null,
)(ProjectPrefaceViewComponent);
