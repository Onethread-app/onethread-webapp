import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface DueDateViewComponentInternalProps {
  dueDate?: Date;
}

export const DueDateViewComponent = (
  props: DueDateViewComponentInternalProps,
) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <h1 className="f6">
        {t('app.project.Project-boards.Due-Date')}
      </h1>
      {/* <h1 className="f6">Due Date</h1> */}
      {props.dueDate ? (
        <p>{moment(props.dueDate).format('MMM Do YYYY')}</p>
      ) : (
        <p>{t('app.project.Project-boards.No-date')}</p>
        // <p>Days has not been set</p>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    dueDate: state.boardIndexReducer.boardReducer.currentTask.dueDate,
  };
};

export const DueDateView = connect(
  mapStateToProps,
  null,
)(DueDateViewComponent);
