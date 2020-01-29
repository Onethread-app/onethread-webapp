import React from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { priorityColor } from 'stores/UtilsActions';

interface PriorityViewComponentInternalProps {
  priority?: number;
}

export const PriorityViewComponent = (props: PriorityViewComponentInternalProps) => {
  return (
    <>
      <h3>Priority</h3>
      {
        props.priority! > -1 &&
        <p
          style={{ color: find(priorityColor, ['code', props.priority])!.value }}
        >
          {find(priorityColor, ['code', props.priority])!.name}
        </p>
      }

    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    priority: state.boardIndexReducer.boardReducer.currentTask.priority,
  };
};

export const PriorityView = connect(mapStateToProps, null)(PriorityViewComponent);
