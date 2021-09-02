import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ITask } from 'stores/board/Reducer';
import { TaskTitleEditor } from './TaskTitleEditor';
import { ICompany } from 'stores/company/Reducer';
import { projectPermit } from 'stores/UtilsActions';
import moment from 'moment';
import { Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

interface TaskDetailsInternalProps {
  currentTask?: ITask;
  company?: ICompany;
}

export const TaskTitleViewComponent = (
  props: TaskDetailsInternalProps,
) => {
  const [nameEdit, setNameEdit] = useState(false);

  return (
    <>
      {nameEdit ? (
        <TaskTitleEditor
          nameEdit={nameEdit}
          setNameEdit={(e) => setNameEdit(!nameEdit)}
        />
      ) : (
        <div className="mv2">
          <h5
            style={{
              fontSize: '12px',
              color: '#666666',
              lineHeight: '15px',
              fontWeight: 400,
              margin: '0.2rem 0rem',
            }}
          >
            TASK
          </h5>
          <h3
            title="Click to edit title"
            className="fw6 mb0 mv2 dim"
            style={{
              cursor: 'text',
              fontSize: '25px',
            }}
            onClick={() => {
              props.company && projectPermit(props.company.role)
                ? setNameEdit(true)
                : setNameEdit(false);
            }}
          >
            {props.currentTask!.name}
          </h3>
          <h5
            style={{
              fontSize: '14px',
              color: '#666666',
              lineHeight: '15px',
              fontWeight: 400,
              margin: '0.2rem 0rem',
            }}
          >
            Task created by {props.currentTask!.createdBy}
          </h5>
          <div className="flex justify-end">
            {props.currentTask!.dueDate && (
              <>
                {Math.ceil(
                  moment(props.currentTask!.dueDate).diff(
                    moment(),
                    'days',
                    true,
                  ),
                ) === 0 ? (
                  <p className="fw6 red mv2">Deadline ends today</p>
                ) : Math.ceil(
                    moment(props.currentTask!.dueDate).diff(
                      moment(),
                      'days',
                      true,
                    ),
                  ) < 0 ? (
                  <p className="fw6 red mv2">Expired</p>
                ) : Math.ceil(
                    moment(props.currentTask!.dueDate).diff(
                      moment(),
                      'days',
                      true,
                    ),
                  ) === 1 ? (
                  <p className="fw6 mv2 flex items-center">
                    <Icon
                      style={{
                        color: '#323030',
                      }}
                      icon={IconNames.TIME}
                      iconSize={12}
                      className="grow pointer pl2 pr2"
                    />{' '}
                    {Math.ceil(
                      moment(props.currentTask!.dueDate).diff(
                        moment(),
                        'days',
                        true,
                      ),
                    )}{' '}
                    day remaining
                  </p>
                ) : (
                  <p className="fw6  mv2 flex items-center">
                    <Icon
                      style={{
                        color: '#323030',
                      }}
                      icon={IconNames.TIME}
                      iconSize={12}
                      className="grow pointer pl2 pr2"
                    />{' '}
                    {Math.ceil(
                      moment(props.currentTask!.dueDate).diff(
                        moment(),
                        'days',
                        true,
                      ),
                    )}{' '}
                    days remaining
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
    company: state.companyReducer.currentCompany,
  };
};

export const TaskTitleView = connect(
  mapStateToProps,
  null,
)(TaskTitleViewComponent);
