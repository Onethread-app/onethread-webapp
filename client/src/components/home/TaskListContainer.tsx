import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import styled from 'styled-components';
import TaskTableContainer from './TaskTableContainer';

const TaskListContainerDiv = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
  position: relative;
  max-width: 1000px;
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
    width: 30%;
    display: flex;
    align-items: center;
  }

  &:nth-child(2) {
    width: 15% !important;
  }

  &:not(:first-child) {
    width: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:last-child {
    width: 20%;
    justify-content: flex-end !important;
  }
`;

const TaskListContainer = (props: any) => {
  return (
    <TaskListContainerDiv>
      <ListHeader>
        <HeaderItem>
          <h3>TASK NAME</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>PROJECT</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>PRIORITY</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>STATUS</h3>
        </HeaderItem>
        <HeaderItem>
          <h3>DUE DATE</h3>
        </HeaderItem>
      </ListHeader>
      <TaskTableContainer tasks={props.tasks} />
    </TaskListContainerDiv>
  );
};

export default TaskListContainer;
