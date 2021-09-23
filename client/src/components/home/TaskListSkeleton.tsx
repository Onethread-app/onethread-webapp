import Skeleton from '@material-ui/lab/Skeleton';

import { TasksContainerDiv } from './TaskTableContainer';
import { TaskItemContainer } from './TaskLitsItem';

const TaskListSkeleton = () => (
  <TasksContainerDiv className='ma3'>
    {[...Array(6)].map((x, i) => (
      <TaskItemContainer key={i}>
        <Skeleton
          animation='wave'
          className='w-100'
          height={25}
        />
      </TaskItemContainer>
    ))}
  </TasksContainerDiv>
);

export default TaskListSkeleton;
