import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

interface DueDateViewComponentInternalProps {
  dueDate?: Date;
}

export const DueDateViewComponent = (props: DueDateViewComponentInternalProps ) => {
  return (
    <>
    <h3>Due Date</h3>
    {
      props.dueDate &&
      <p>{moment(props.dueDate).format('MMM Do YY') }</p>
    }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    dueDate : state.boardIndexReducer.boardReducer.currentTask.dueDate,
  };
};

export const DueDateView = connect(mapStateToProps, null)(DueDateViewComponent);
