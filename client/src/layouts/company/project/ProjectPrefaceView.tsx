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

interface ProjectPrefaceProps {
  description: string;
  outline: string;
  files: any;
  role: string;
  optionalRole: any;
  projectMembers: any;
}

export const ProjectPrefaceViewComponent = (
  props: ProjectPrefaceProps,
) => {
  const [showFileDialog, setShowFileDialog] = useState(false);

  return (
    <>
      <h1 className="f3 ph5-ns">Preface</h1>
      <div className="flex w-100 ph4-ns">
        <div className="h-auto w-70 pa4">
          <div className="w-90">
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
        <div className="w-30 pa4">
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
                      {member.role}
                    </h1>
                  </div>
                </article>
              </div>
            ))}
          {/* <h1 className="f6 pointer blue mv0 fr">Show All</h1> */}
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
  role: state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole.projects.project.optionalRole,
  projectMembers: state.projectReducer.projectDetails.members,
});

export const ProjectPrefaceView = connect(
  mapStateToProps,
  null,
)(ProjectPrefaceViewComponent);
