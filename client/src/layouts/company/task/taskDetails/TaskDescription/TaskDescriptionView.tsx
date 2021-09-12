import React, { useState } from 'react';
import { TaskDescriptionEditor } from './TaskDescriptionEditor';
import { Icon } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ITask } from 'stores/task/Reducer';
import { ICompany } from 'stores/company/Reducer';
import Linkify from 'react-linkify';
import { componentDecorator } from 'helpers/LinkifyHelper';
import { useTranslation } from 'react-i18next';

interface TaskDescriptionViewInternalProps {
  description?: ITask['description'];
  company?: ICompany;
}

export const TaskDescriptionViewComponent = (
  props: TaskDescriptionViewInternalProps,
) => {
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(
    false,
  );

  const { t } = useTranslation();

  return (
    <>
      <div
        className="flex justify-between"
        style={{ height: '50px' }}
      >
        <h1
          style={{
            color: '#323030',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '28px',
          }}
        >
          {t('app.project.Project-boards.Description')}:
        </h1>
        <div className="pr2 pt1">
          {props.company ? (
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
          ) : undefined}
        </div>
      </div>
      {editDescriptionDialog ? (
        <TaskDescriptionEditor
          editDescriptionDialog={editDescriptionDialog}
          setEditDescriptionDialog={(e) =>
            setEditDescriptionDialog(!editDescriptionDialog)
          }
        />
      ) : props.description ? (
        <Linkify componentDecorator={componentDecorator}>
          <p
            className="pr2 ws-break"
            style={{
              whiteSpace: 'pre-line',
              maxHeight: '160px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: '24px',
              fontWeight: 400,
            }}
          >
            {props.description}
          </p>
        </Linkify>
      ) : (
        <p className="pr2">
          {t('app.project.Project-boards.No-description')}
        </p>
        // <p className="pr2">Description has not been given yet</p>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    description:
      state.taskIndexReducer.taskReducer.currentTask.description,
    company: state.companyReducer.currentCompany,
  };
};

export const TaskDescriptionView = connect(
  mapStateToProps,
  null,
)(TaskDescriptionViewComponent);
