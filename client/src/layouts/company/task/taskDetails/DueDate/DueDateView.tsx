import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import moment from 'moment';

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
      {props.dueDate ? (
        <p>{moment(props.dueDate).format('MMM Do YYYY')}</p>
      ) : (
        <p>{t('app.project.Project-boards.No-date')}</p>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    dueDate: state.taskIndexReducer.taskReducer.currentTask.dueDate,
  };
};

export const DueDateView = connect(
  mapStateToProps,
  null,
)(DueDateViewComponent);
