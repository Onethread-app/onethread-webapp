import Paper from '@material-ui/core/Paper';
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
import { priorityColor } from 'stores/UtilsActions';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      color: 'black',
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
      },
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
    table: {
      minWidth: 750,
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

interface Data {
  name: string;
  status: string;
  dueDate: string;
  assign: string;
  priority: string;
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

interface HeadCell {
  id: keyof Data;
  label: string;
}

const headCells: HeadCell[] = [
  {
    id: 'name',
    label: 'Deliverable',
  },
  {
    id: 'assign',
    label: 'Resource Assign',
  },
  {
    id: 'priority',
    label: 'Priority',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'dueDate',
    label: 'End',
  },
];

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

  return (
    <TableHead>
      <TableRow>
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
              <b style={{ fontSize: 16.5 }}>{headCell.label}</b>
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

const PriorityButton = ({ value }) => {
  let priorObject: any = priorityColor.find((p) => p.code === value);
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
}) => {
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
  return (
    <div className={classes.root} style={{ paddingTop: 20 }}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
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
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.name}
                    >
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align={'center'}
                      >
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.assign ? row.assign : '-'}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <PriorityButton value={row.priority} />
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <span
                          className="ph2 pv1"
                          style={{
                            fontWeight: 'normal',
                            backgroundColor: '#fca11c',
                            marginLeft: 5,
                            color: 'white',
                            borderRadius: 2,
                          }}
                        >
                          {row.status}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.dueDate ? row.dueDate : '-'}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default AppTable;
