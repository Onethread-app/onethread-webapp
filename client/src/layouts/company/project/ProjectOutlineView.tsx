import React, { useState } from 'react';
import { Icon } from '@blueprintjs/core';
import { ProjectOutlineEditor } from './ProjectOutlineEditor';
import { connect } from 'react-redux';
import { projectRules } from './settings/projectrules';
import { Text } from '@blueprintjs/core';

interface IProjectDescriptionViewProps {
  headline: string;
  projectOutline: string;
  role?: string;
  optionalRole?: any;
}

export const _ProjectOutlineView = (
  props: IProjectDescriptionViewProps,
) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(
    false,
  );
  return (
    <>
      <div
        className="flex justify-between"
        style={{ height: '30px' }}
      >
        <div>
          <h1 className="f6">{props.headline}</h1>
        </div>
        {props.role === 'admin' ? (
          <div className="pr2" style={{ paddingTop: '10px' }}>
            <Icon
              className={editDescriptionDialog ? 'fr tigrow-lightBlue pointer' : 'fr silver pointer'}
              icon="edit"
              onClick={() => {
                setEditDescriptionDialog(!editDescriptionDialog);
              }}
            />
          </div>
        ) : (
          props.optionalRole &&
          projectRules(props.optionalRole)[props.role!].includes(
            'updateProjectPreface',
          ) && (
            <div className="pr2" style={{ paddingTop: '10px' }}>
              <Icon
                className="fr silver pointer"
                icon="edit"
                onClick={() => {
                  setEditDescriptionDialog(true);
                }}
              />
            </div>
          )
        )}
      </div>
      {editDescriptionDialog ? (
        <ProjectOutlineEditor
          editableOutline={props.projectOutline}
          editableOutline={props.projectOutline}
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={() =>
            setEditDescriptionDialog(!editDescriptionDialog)
          }
        />
      ) : undefined}
      <div style={{ lineHeight: '25px' }}>
        <Text ellipsize={true} className="pr2 ws-normal">
          {props.projectOutline}
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

export const ProjectOutlineView = connect(
  mapStateToProps,
  null,
)(_ProjectOutlineView);
