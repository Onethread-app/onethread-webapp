import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

interface DueDateViewComponentInternalProps {
  dueDate?: Date;
}

export const DueDateViewComponent = (props: DueDateViewComponentInternalProps) => {
  return (
    <>
      <div style={{ height: '20px' }}>
        <h1 className="f6">Due Date</h1>
      </div>
      {
        props.dueDate ?
          <p>{moment(props.dueDate).format('MMM Do YYYY')}</p> :
          <p>Days has not been set</p>
      }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    dueDate: state.boardIndexReducer.boardReducer.currentTask.dueDate,
  };
};

export const DueDateView = connect(mapStateToProps, null)(DueDateViewComponent);
