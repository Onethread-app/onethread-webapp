import React from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import { priorityColor } from 'stores/UtilsActions';

interface PriorityViewComponentInternalProps {
  priority?: number;
}

export const PriorityViewComponent = (
  props: PriorityViewComponentInternalProps,
) => {
  return (
    <>
      <div style={{ height: '20px' }}>
        <h1 className="f6">Priority</h1>
      </div>
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
    </>
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
