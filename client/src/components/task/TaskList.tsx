import React from 'react';
import { connect } from 'react-redux';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';

import SettingsIcon from '@material-ui/icons/Settings';

import TasksContainer from './ListTasksContainer';
import CreateTaskButton from './CreateTaskButton';
import { TaskBoard } from 'stores/board/Reducer';

const TaskListContainer = styled.div`
  padding: 1rem;
  flex-grow: 1;
  background: #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
  position: relative;
  max-width: 100%;
  overflow-x: auto;
  margin-bottom: ${isMobileOnly ? '4rem' : 0};
`;

const ListHeader = styled.div`
  display: flex;
  padding: 0 1rem;
  min-width: 680px;
`;
const HeaderItem = styled.div`
  h3 {
    display: inline-block;
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }

  &:first-child {
    width: 27%;
    display: flex;
    align-items: center;
  }

  &:nth-child(2) {
    width: 10% !important;
  }

  &:not(:first-child) {
    width: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:last-child {
    width: 3%;
    justify-content: flex-end !important;
  }
`;

interface ITaskList {
  currentBoard: TaskBoard;
}

const TaskList = (props: ITaskList) => {
  const [todoColumnId, setTodoColumnId] = React.useState('');

  React.useEffect(() => {
    if (props.currentBoard.columns.length > 0)
      setTodoColumnId(
        props.currentBoard.columns.filter(
          (col) => col.name.toLowerCase() === 'to do',
        )[0]._id,
      );
  }, [props.currentBoard]);

  return (
    <TaskListContainer>
      <ListHeader>
        <HeaderItem>
          <h3>Task Name</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>Activity</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>Priority</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>Status</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>Due Date</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>Assigned Member</h3>
        </HeaderItem>
        <HeaderItem>
          <SettingsIcon htmlColor="#a1a1a1" />
        </HeaderItem>
      </ListHeader>
      <TasksContainer />
      <CreateTaskButton columnId={todoColumnId} />
    </TaskListContainer>
  );
};

const mapStateToProps = (state: any) => ({
  currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
});

export default connect(mapStateToProps)(TaskList);
