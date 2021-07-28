import { LinearProgress } from '@material-ui/core';
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
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import React from 'react';
import MemberIcon from 'components/member/MemberIcon';

import { useHistory } from 'react-router-dom';
import { priorityColor } from 'stores/UtilsActions';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:first-child': { paddingRight: 5 },
      '&:last-child': { paddingRight: 5 },
    },
    head: { color: 'black' },
    body: { fontSize: 14 },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#fefefe',
      cursor: 'pointer',
    },
  }),
)(TableRow);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[
          theme.palette.type === 'light' ? 300 : 700
        ],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  }),
)(LinearProgress);

interface Data {
  taskname: string;
  projectname: string;
  priority: number;
  members: string;
  dueDate: string;
  status: string;
  subtask: number;
}

function descendingComparator(a, b, orderBy) {
  if (orderBy === 'dueDate') {
    return (
      new Date(b[orderBy]).valueOf() - new Date(a[orderBy]).valueOf()
    );
  }
  if (orderBy === 'subtask') {
    return b['remainingSubtask'] - a['remainingSubtask'];
  }
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map(
    (el, index) => [el, index] as [T, number],
  );
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>,
  ) => {
    onRequestSort(event, property);
  };

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: HeadCell[] = [
    {
      id: 'taskname',
      label: `Task name`,
    },
    {
      id: 'projectname',
      label: `Project name`,
    },
    {
      id: 'members',
      label: `Assignee`,
    },
    {
      id: 'priority',
      label: `Priority`,
    },
    {
      id: 'status',
      label: `Status`,
    },
    {
      id: 'dueDate',
      label: `Due date`,
    },
    {
      id: 'subtask',
      label: 'Subtask',
    },
  ];

  return (
    <TableHead>
      <TableRow
        style={{
          background: '#fafafa',
          border: '1px solid #eee',
          borderBottomColor: 'transparent',
        }}
      >
        {headCells.map((headCell, index) => (
          <StyledTableCell
            key={headCell.id}
            align={index === 0 ? 'center' : 'left'}
            padding={'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <p
                style={{
                  fontSize: 15,
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                {headCell.label}
              </p>
              {orderBy === headCell.id &&
              headCell.id === 'dueDate' ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc'
                    ? 'sorted descending'
                    : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const AppTable = ({
  order,
  setOrder,
  orderBy,
  setOrderBy,
  selected,
  setSelected,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  tasks,
  ...otherProps
}) => {
  const history = useHistory();
  const classes = useStyles();

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, tasks.length - page * rowsPerPage);

  const PriorityButton = ({ value }) => {
    const priorObject: any = priorityColor.find(
      (p) => p.code === value,
    );
    return (
      <span
        className="ph2 pv1"
        style={{
          background: priorObject.value,
          color: 'white',
          borderRadius: 2,
        }}
      >
        {priorObject.name}
      </span>
    );
  };

  return (
    <>
      <div className={classes.root} style={{ paddingTop: 5 }}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tasks.length}
            />
            <TableBody>
              {stableSort(tasks, getComparator(order, orderBy))
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
                .map((row: any, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row._id}
                      style={{
                        borderRadius: 10,
                        border: '1px solid #eee',
                      }}
                      onClick={() =>
                        history.push(
                          `/company/${row.companyUniqueName}/project/${row.projectId}/board/${row.boardId}/task/${row.taskId}`,
                        )
                      }
                    >
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align={'center'}
                        style={{
                          maxWidth: 250,
                          lineHeight: 1.5,
                        }}
                      >
                        <p
                          style={{
                            padding: 10,
                            paddingLeft: 13,
                            paddingRight: 13,
                          }}
                        >
                          {row.taskname}
                        </p>
                      </StyledTableCell>
                      <StyledTableCell style={{ maxWidth: 100 }}>
                        {row.projectname}
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        style={{ maxWidth: 70 }}
                      >
                        {row.members.length ? (
                          <div className="flex items-center justify-center">
                            {row.members.map((member: any) => (
                              <MemberIcon
                                name={`${member.firstName} ${member.lastName}`}
                                _id={member._id}
                                profileImage={member.profileImage}
                              />
                            ))}
                          </div>
                        ) : (
                          '-'
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ maxWidth: 70 }}
                      >
                        <PriorityButton value={row.priority} />
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        <span
                          className="bp3-tag ttc"
                          style={{
                            background:
                              row.status === 'done'
                                ? '#2EB67D'
                                : row.status === 'in-progress'
                                ? '#08A0F7'
                                : '#FFA800',
                            maxWidth: 100,
                          }}
                        >
                          {row.status
                            .toString()
                            .replace(/-/g, ' ')
                            .toUpperCase()}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{ maxWidth: 70 }}
                      >
                        <span>
                          {row.dueDate !== 'December 31, 1970'
                            ? row.dueDate
                            : 'Not Set'}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell style={{ minWidth: 150 }}>
                        <div className="flex items-center">
                          <div className="w-60">
                            <BorderLinearProgress
                              variant="determinate"
                              value={
                                (row.doneSubtasks * 100) /
                                row.totalSubtasks
                              }
                            />
                          </div>
                          <span
                            className="w-40"
                            style={{
                              paddingLeft: 10,
                            }}
                          >{`${
                            row.totalSubtasks -
                            parseInt(row.doneSubtasks)
                          } / ${row.totalSubtasks}`}</span>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default AppTable;
