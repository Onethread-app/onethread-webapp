import React, { useState } from 'react';
import { connect } from 'react-redux';

import Linkify from 'react-linkify';
import { Text } from '@blueprintjs/core';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { projectRules } from './settings/projectrules';
import { componentDecorator } from 'helpers/LinkifyHelper';
import { ProjectOutlineEditor } from './ProjectOutlineEditor';

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
        {props.role === 'admin' ? (
          <div className="pr2" style={{ paddingTop: '10px' }}>
            <Icon
              className={
                editDescriptionDialog
                  ? 'fr tigrow-lightBlue pointer'
                  : 'fr silver pointer'
              }
              icon="edit"
              onClick={() => {
                setEditDescriptionDialog(!editDescriptionDialog);
              }}
            />
          </div>
        ) : (
          permissions.grantAll ||
          (permissions.projectModerator &&
            permissions.projectModerator.includes(
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
            ))
        )}
      </div>
      {editDescriptionDialog ? (
        <ProjectOutlineEditor
          editableOutline={props.projectOutline}
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={() =>
            setEditDescriptionDialog(!editDescriptionDialog)
          }
        />
      ) : undefined}
      <div style={{ lineHeight: '25px' }}>
        <Linkify componentDecorator={componentDecorator}>
          <Text ellipsize={true} className="pr2 ws-normal">
            {props.projectOutline}
          </Text>
        </Linkify>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  role:
    state.projectReducer.projectRole &&
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole &&
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project &&
    state.projectReducer.projectRole.projects.project.optionalRole,
});

export const ProjectOutlineView = connect(
  mapStateToProps,
  null,
)(_ProjectOutlineView);
