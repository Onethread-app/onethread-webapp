import { useHistory } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles/createTheme';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer/TableContainer';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';

const StyledTableCell = withStyles((theme: Theme) => createStyles({
  root: {
    borderBottom: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
    // marginBottom: 10,
    '&:first-child': {
      paddingRight: 5,
      // borderRadius: 5,
      // marginBottom: 10,
    },
    '&:last-child': {
      paddingRight: 5,
    },
  },
  head: {
    // backgroundColor: 'rgba(0, 0, 0, 0.01)',
    color: 'black',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme: Theme) => createStyles({
  root: {
    backgroundColor: '#fefefe',
    cursor: 'pointer',
    // boxShadow: '1px 1px solid black
  },
}))(TableRow);

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    // minWidth: 750,
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
}));

interface Data {
  no: string;
  taskName: string;
  assignee: string;
  deadline: string;
  status: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
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
  assignedByUser: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes, order, orderBy, onRequestSort, assignedByUser,
  } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  interface HeadCell {
    id: keyof Data;
    label: string;
  }

  const headCells: HeadCell[] = [
    {
      id: 'no',
      label: 'No',
    },
    {
      id: 'taskName',
      label: 'Task Name',
    },
    {
      id: 'assignee',
      label: 'Assignee',
    },
    {
      id: 'deadline',
      label: 'Deadline',
    },
    {
      id: 'status',
      label: 'Status',
    },
  ];

  const assigneeExists = (id, assignedByUser) => id !== 'assignee' || (id === 'assignee' && assignedByUser);
  return (
    <TableHead>
      <TableRow>
        {headCells
          .filter((t) => assigneeExists(t.id, assignedByUser))
          .map((headCell, index) => (
            <StyledTableCell
              key={headCell.id}
              align={index === 0 ? 'center' : 'left'}
              padding='default'
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <p
                  style={{
                    fontSize: 11.5,
                    color: '#666',
                  }}
                >
                  {headCell.label}
                </p>
                {orderBy === headCell.id
                && headCell.id === 'deadline' ? (
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
  assignedByUser,
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

  const emptyRows = rowsPerPage
    - Math.min(rowsPerPage, tasks.length - page * rowsPerPage);
  return (
    <div className={classes.root} style={{ paddingTop: 5 }}>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby='tableTitle'
          size='medium'
          aria-label='enhanced table'
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={tasks.length}
            assignedByUser={assignedByUser}
          />
          <TableBody>
            {stableSort(tasks, getComparator(order, orderBy))
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
              )
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow
                    hover
                    role='checkbox'
                    tabIndex={-1}
                    key={row.no}
                    style={{ borderRadius: 10 }}
                    onClick={() => history.push(row.redirectTo.toString())}
                  >
                    <StyledTableCell
                      component='th'
                      id={labelId}
                      scope='row'
                      padding='none'
                      align='center'
                    >
                      {row.no}
                    </StyledTableCell>
                    <StyledTableCell align='left'>
                      {row.taskName ? row.taskName : '-'}
                    </StyledTableCell>
                    {assignedByUser && (
                      <StyledTableCell align='left'>
                        {row.assignee}
                      </StyledTableCell>
                    )}
                    <StyledTableCell align='left'>
                      <span>{row.deadline}</span>
                    </StyledTableCell>
                    <StyledTableCell align='left'>
                      <span
                        className='bp3-tag ttc'
                        style={{
                          background:
                            row.status === 'done'
                              ? '#2EB67D'
                              : row.status === 'in-progress'
                                ? '#08A0F7'
                                : '#FFA800',
                        }}
                      >
                        {row.status
                          .toString()
                          .replace(/-/g, ' ')
                          .toUpperCase()}
                      </span>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53,
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
        component='div'
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AppTable;
