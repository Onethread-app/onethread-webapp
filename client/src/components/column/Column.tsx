import { useState } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

import { ITaskStatus } from 'stores/task/Reducer';
import { useTasksTableContext } from 'components/task/TasksTableContext';

import TasksContainer from 'components/task/TasksContainer';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

const ColumnContainer = styled.div`
  padding: 1rem 0.5rem;
  max-width: 300px;
  min-width: 235px;
  gap: 0.75rem;
  border-radius: 5px;
  transition: height 0.5s ease-in;
  height: 100%;
`;

const ColumnHeader = styled.h3`
  font-size: 18px;
  line-height: 30px;
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
  color: #323030;
  display: flex;
  align-items: center;
`;

const HeaderIcon = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.columnName === 'done'
      ? '#62C89D'
      : props.columnName === 'in-progress'
      ? '#08A0F7'
      : '#FFA800'};
  margin-right: 0.5rem;
`;

interface IColumnProps {
  index: number;
  status: ITaskStatus;
  setUpdateStatus: React.Dispatch<React.SetStateAction<ITaskStatus>>;
  setShowEditStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const Column = (props: IColumnProps) => {
  const { status } = props;
  const { tasks } = useTasksTableContext();
  const [columnName] = useState(
    status.name.toLowerCase().split(' ').join('-'),
  );

  return (
    <Draggable draggableId={status._id} index={props.index}>
      {(provided, snapshot) => {
        return (
          <div
            className="flex flex-column"
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <ColumnContainer
              className={`flex flex-column justify-center mb3`}
              isDragging={snapshot.isDragging}
              columnName={columnName}
            >
              <ColumnHeader {...provided.dragHandleProps}>
                <HeaderIcon columnName={columnName} />
                {status.name}
                <span className="ml2">{`(${
                  tasks.filter(
                    (task) => task.status?._id === status?._id,
                  ).length
                })`}</span>
                <EditOutlinedIcon
                  className="ml-auto"
                  onClick={() => {
                    props.setShowEditStatus(true);
                    props.setUpdateStatus(status);
                  }}
                />
              </ColumnHeader>
              <TasksContainer status={status} />
            </ColumnContainer>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Column;
