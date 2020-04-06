import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { ProjectDescriptionEditor } from './ProjectDescriptionEditor';
import { connect } from 'react-redux';
import { projectRules } from './settings/projectrules';
import { Text } from "@blueprintjs/core"


interface IProjectDescriptionViewProps {
  headline: string;
  description: string;
  role?: string;
  optionalRole?: any;
}

export const _ProjectDescriptionView = (
  props: IProjectDescriptionViewProps
) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(false);
  return (
    <>
      <div className='flex justify-between' style={{ height: '30px' }}>
        <div>
          <h1 className='f6'>{props.headline}</h1>
        </div>

        {props.role === 'admin' ? (
          <div className='pr2' style={{ paddingTop: '10px' }}>
            <Icon
              className='fr silver pointer'
              icon='edit'
              onClick={() => {
                setEditDescriptionDialog(true);
              }}
            />
          </div>
        ) : (
            props.optionalRole &&
            projectRules(props.optionalRole)[props.role!].includes(
              'updateProjectPreface'
            ) && (
              <div className='pr2' style={{ paddingTop: '10px' }}>
                <Icon
                  className='fr silver pointer'
                  icon='edit'
                  onClick={() => {
                    setEditDescriptionDialog(true);
                  }}
                />
              </div>
            )
          )}
      </div>
      {editDescriptionDialog ? (
        <ProjectDescriptionEditor
          // projectPrefaceDescriptionUpdate={projectPrefaceDescriptionUpdate}
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={() =>
            setEditDescriptionDialog(!editDescriptionDialog)
          }
        />
      ) : (
          undefined
        )}
      <Text ellipsize={true} className='pr2 ws-normal'>{props.description}</Text>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  role: state.projectReducer.projectRole.projects.role,
  optionalRole: state.projectReducer.projectRole.projects.project.optionalRole
});

export const ProjectDescriptionView = connect(
  mapStateToProps,
  null
)(_ProjectDescriptionView);
