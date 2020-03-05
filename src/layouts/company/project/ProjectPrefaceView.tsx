import * as React from 'react';
import { ProjectDescriptionView } from './ProjectDescriptionView';
import DownloadIcon from './../../../resources/images/Download.svg';
import { Button, Dialog } from '@blueprintjs/core';
import user from '../../../resources/images/profilePhoto.svg';
import { useState } from 'react';
import { FileUpload } from './fileUpload';
import { connect } from 'react-redux';
import { ProjectOutlineView } from './ProjectOutlineView'
// import { connect } from 'http2';

export const ProjectPrefaceViewComponent = (props: any) => {

  const [showFileDialog, setShowFileDialog] = useState(false);

  return (
    <>
      <h1 className="f3 ph5-ns">Preface</h1>
      {console.log(props)}
      <div className="flex w-100 ph4-ns">
        <div className="h-auto w-70 pa4">
          <div className="w-90">
            <ProjectDescriptionView projectDescription={props.projectDesription} headline={'Project Description'} />
            <ProjectOutlineView projectOutline={props.projectOutline} headline={'Project Outline'} />
          </div>
        </div>
        <div className="w-30 pa4">
          <h1 className="f6">Shared Files</h1>
          <div className="flex items-center justify-between">
            <h1 className="f6 fw6 blue">ProjectDocumentation.pptx</h1>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              download>
              <span className="flex pl3">
                <img
                  src={DownloadIcon}
                  alt="Download icon"
                  style={{
                    width: '23px',
                    height: '23px'
                  }}
                />
              </span>
            </a>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="f6 fw6 blue">ProjectDocumentation.pptx</h1>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              download>
              <span className="flex pl3">
                <img
                  src={DownloadIcon}
                  alt="Download icon"
                  style={{
                    width: '23px',
                    height: '23px'
                  }}
                />
              </span>
            </a>
          </div>
          <Button
            className="pointer w4 pa2 flex flex-column center mb5 mt4"
            style={{
              background: '#fff',
              outline: 'none',
              border: '2px solid blue',
              color: 'blue'
            }}
            onClick={() => setShowFileDialog(true)}
          >
            Upload Files
          </Button>
          <h1 className="f6 pb2">Project Members</h1>
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
                John Martial
              </h1>
              <h1 className="f7 fw4 black mv1">
                Project Manager
              </h1>
            </div>
          </article>
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
                John Martial
              </h1>
              <h1 className="f7 fw4 black mv1">
                Project Manager
              </h1>
            </div>
          </article>
          <h1 className="f6 pointer blue mv0 fr">
            Show All</h1>
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
          <FileUpload setShowDialog={setShowFileDialog} projectID={'123'} />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  projectDescription: state.projectReducer.projectDetails.description,
  projectOutline: state.projectReducer.projectDetails.outline
});

export const ProjectPrefaceView = connect(mapStateToProps, null)(ProjectPrefaceViewComponent);