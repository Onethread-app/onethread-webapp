import Skeleton from '@material-ui/lab/Skeleton';
import {
  StyledTable,
  StyledTableRow,
} from 'components/table/StyledTable.styles';

const TaskTableSkeleton = () => {
  return (
    <StyledTable>
      {[...Array(window.innerHeight > 1079 ? 10 : 5)].map((x, i) => (
        <StyledTableRow key={i}>
          <Skeleton className={`w-100`} height={25} />
        </StyledTableRow>
      ))}
    </StyledTable>
  );
};

export default TaskTableSkeleton;
