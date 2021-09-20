import { useState } from 'react';
import Linkify from 'react-linkify';
import { connect } from 'react-redux';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Text } from '@blueprintjs/core';

import { projectRules } from './settings/projectrules';
import { componentDecorator } from 'helpers/LinkifyHelper';
import { ProjectDescriptionEditor } from './ProjectDescriptionEditor';

interface IProjectDescriptionViewProps {
  headline: string;
  description: string;
  role?: string;
  optionalRole?: any;
}

export const _ProjectDescriptionView = (
  props: IProjectDescriptionViewProps,
) => {
  const [editDescriptionDialog, setEditDescriptionDialog] =
    useState(false);
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

        {(permissions.grantAll ||
          (permissions.projectModerator &&
            permissions.projectModerator.includes(
              'updateProjectPreface',
            ))) && (
          <div className="pr2" style={{ paddingTop: '10px' }}>
            <Icon
              className={
                permissions.grantAll
                  ? editDescriptionDialog
                    ? 'fr tigrow-lightBlue pointer'
                    : 'fr silver pointer'
                  : 'fr silver pointer'
              }
              icon="edit"
              onClick={() => {
                setEditDescriptionDialog(!editDescriptionDialog);
              }}
            />
          </div>
        )}
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
        <Linkify componentDecorator={componentDecorator}>
          <Text ellipsize={true} className="pr2 ws-normal">
            {props.description}
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

export const ProjectDescriptionView = connect(
  mapStateToProps,
  null,
)(_ProjectDescriptionView);
