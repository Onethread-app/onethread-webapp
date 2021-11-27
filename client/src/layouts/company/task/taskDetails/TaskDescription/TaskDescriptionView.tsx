import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Linkify from 'react-linkify';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { ITask } from 'stores/task/Reducer';
import { ICompany } from 'stores/company/Reducer';

import { componentDecorator } from 'helpers/LinkifyHelper';
import { TaskDescriptionEditor } from './TaskDescriptionEditor';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
interface TaskDescriptionViewInternalProps {
  description?: ITask['description'];
  company?: ICompany;
}

export const TaskDescriptionViewComponent = (
  props: TaskDescriptionViewInternalProps,
) => {
  const { t } = useTranslation();
  const [editDescriptionDialog, setEditDescriptionDialog] =
    useState(false);
  const [expandDescription, setExpandDescription] =
    useState<boolean>(true);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1
          style={{
            color: '#323030',
            fontSize: '18px',
            fontWeight: 700,
            lineHeight: '28px',
          }}
          className="flex items-center"
        >
          {expandDescription ? (
            <ArrowDropDownIcon
              className="mr1"
              onClick={() => setExpandDescription(false)}
            />
          ) : (
            <ArrowRightIcon
              className="mr1"
              onClick={() => setExpandDescription(true)}
            />
          )}
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
      ) : expandDescription ? (
        <div className="ml2">
          {props.description ? (
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
            <p className="pr2 ml2">
              {t('app.project.Project-boards.No-description')}
            </p>
          )}
        </div>
      ) : null}
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
