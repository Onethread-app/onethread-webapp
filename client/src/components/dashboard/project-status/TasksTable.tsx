import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import MemberIcon from 'components/member/MemberIcon';
// import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 440,
  },
  head: {
    color: '#65676d',
    fontSize: '1.1rem !important',
  },
  row: {
    transition: 'all 0.25s ease-in',
    '&:hover': {
      background: 'rgba(0,0,0,0.1)',
      cursor: 'pointer',
    },
  },
});

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number,
// ) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[
          theme.palette.type === 'light' ? 200 : 700
        ],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  }),
)(LinearProgress);

interface ITasksTable {
  tasks: any;
}

const TasksTable = (props: ITasksTable) => {
  const [tasks, setTasks] = React.useState<any>();
  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    if (props.tasks) {
      setTasks(props.tasks);
    }
  }, [props.tasks]);

  const handleRowClick = (data: any) => {
    history.push(
      `/company/${data.company.uniqueName}/project/${data.project._id}/board/${data.boardId}/task/${data._id}`,
    );
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.container}>
        <Table
          className={classes.table}
          stickyHeader
          aria-label="task table"
        >
          <TableHead>
            <TableRow>
              <TableCell className={classes.head}>Name</TableCell>
              <TableCell className={classes.head} align="right">
                Members
              </TableCell>
              <TableCell className={classes.head} align="right">
                Status
              </TableCell>
              <TableCell className={classes.head} align="right">
                Due Date
              </TableCell>
              <TableCell className={classes.head} align="right">
                Subtasks Remaining
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks &&
              tasks
                // .slice(
                //   page * rowsPerPage,
                //   page * rowsPerPage + rowsPerPage,
                // )
                .map((data: any) => (
                  <TableRow
                    key={data._id}
                    onClick={() => handleRowClick(data)}
                    className={classes.row}
                  >
                    <TableCell component="th" scope="row">
                      {data.name}
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end">
                        {data.members.map((member: any) => (
                          <MemberIcon
                            name={`${member.firstName} ${member.lastName}`}
                            _id={member._id}
                            profileImage={member.profileImage}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell align="right">{data.status}</TableCell>
                    <TableCell align="right">
                      {data.dueDate
                        ? moment(data.dueDate).format('DD/MM/YYYY')
                        : 'Not Set'}
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center">
                        <div className="w-80">
                          <BorderLinearProgress
                            variant="determinate"
                            value={
                              (data.doneSubtasks * 100) /
                              data.totalSubtasks
                            }
                          />
                        </div>
                        <span className="w-20">{`${
                          data.totalSubtasks - data.doneSubtasks
                        } / ${data.totalSubtasks}`}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </>
  );
};

export default TasksTable;
