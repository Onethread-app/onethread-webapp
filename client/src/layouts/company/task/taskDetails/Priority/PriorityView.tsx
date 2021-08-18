import React from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { priorityColor } from 'stores/UtilsActions';
import { useTranslation } from 'react-i18next';

interface PriorityViewComponentInternalProps {
  priority?: number;
}

export const PriorityViewComponent = (
  props: PriorityViewComponentInternalProps,
) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <h1 className="f6">
        {t('app.project.Project-boards.Priority')}
      </h1>
      {/* <h1 className="f6">Priority</h1> */}
      {props.priority! > -1 && (
        <p
          style={{
            background: find(priorityColor, ['code', props.priority])!
              .value,
            color: '#fff',
            padding: '4px',
            width: '40%',
            textAlign: 'center',
            borderRadius: '2px',
          }}
        >
          {find(priorityColor, ['code', props.priority])!.name}
        </p>
      )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    priority:
      state.boardIndexReducer.boardReducer.currentTask.priority,
  };
};

export const PriorityView = connect(
  mapStateToProps,
  null,
)(PriorityViewComponent);
