import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { ProjectDescriptionEditor } from './ProjectDescriptionEditor';
import { connect } from 'react-redux';
import { projectRules } from './settings/projectrules';
import { Text } from '@blueprintjs/core';

interface IProjectDescriptionViewProps {
  headline: string;
  description: string;
  role?: string;
  optionalRole?: any;
}

export const _ProjectDescriptionView = (
  props: IProjectDescriptionViewProps,
) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(
    false,
  );
  const permissions = projectRules(props.role, props.optionalRole);
  return (
    <>
      <div
        className="flex justify-between"
        style={{ height: '30px' }}
      >
        <div>
          <h1 className="f6">{props.headline}</h1>
        </div>

        {
          (permissions.grantAll || permissions.projectModerator.includes('updateProjectPreface')) &&
          <div className="pr2" style={{ paddingTop: '10px' }}>
              <Icon
              className={permissions.grantAll ?
                    (editDescriptionDialog
                    ? 'fr tigrow-lightBlue pointer'
                    : 'fr silver pointer')
                  : 'fr silver pointer'}
                icon="edit"
                onClick={() => {
                  setEditDescriptionDialog(!editDescriptionDialog);
                }}
              />
            </div>
        }
      </div>
      {editDescriptionDialog ? (
        <ProjectDescriptionEditor
          // projectPrefaceDescriptionUpdate={projectPrefaceDescriptionUpdate}
          editableDescription={props.description}
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={() =>
            setEditDescriptionDialog(!editDescriptionDialog)
          }
        />
      ) : undefined}
      <div style={{ lineHeight: '25px' }}>
        <Text ellipsize={true} className="pr2 ws-normal">
          {props.description}
        </Text>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  role: state.projectReducer.projectRole && state.projectReducer.projectRole.projects &&
   state.projectReducer.projectRole.projects.role,
  optionalRole: state.projectReducer.projectRole && state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project && state.projectReducer.projectRole.projects.project.optionalRole,
});

export const ProjectDescriptionView = connect(
  mapStateToProps,
  null,
)(_ProjectDescriptionView);
