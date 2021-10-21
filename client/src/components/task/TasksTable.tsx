import { useHistory } from 'react-router-dom';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import TablePagination from '@material-ui/core/TablePagination';

import {
  StyledTable,
  StyledTableRow,
  StyledTableHeader,
  StyledTableBody,
  StyledTaskTableData,
  SortIcon,
} from '../table/StyledTable.styles';

interface ITasksTable {
  getTableProps: any;
  getTableBodyProps: any;
  headerGroups: any;
  rows: any;
  prepareRow: any;
  visibleColumns: any;
  page: any;
  gotoPage: any;
  pageSize: any;
  pageIndex: number;
  setPageSize: any;
}

const TasksTable = (props: ITasksTable) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    page,
    pageIndex,
    gotoPage,
    pageSize,
    setPageSize,
  } = props;
  const history = useHistory();

  const handlePageChange = (event, value) => {
    gotoPage(value);
  };

  const handleChangeRowsPerPage = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    gotoPage(0);
  };

  const handleClick = (task) => {
    history.push(
      `/company/${task.company.uniqueName}/project/${task.project._id}/board/${task.boardId}/task/${task._id}`,
    );
  };

  return (
    <>
      <StyledTable {...getTableProps()}>
        <StyledTableHeader>
          {headerGroups.map((headerGroup) => (
            <StyledTableRow {...headerGroup.getHeaderGroupProps()}>
              <Icon icon="circle" iconSize={16} className="o-0 mr3" />
              {headerGroup.headers.map((column) => (
                <StyledTaskTableData
                  cols={visibleColumns.length}
                  {...column.getHeaderProps(
                    column.getSortByToggleProps(),
                  )}
                >
                  {column.render('Header')}
                  <SortIcon>
                    <Icon
                      icon="symbol-triangle-up"
                      size={7.5}
                      color={
                        column.isSorted
                          ? column.isSortedDesc
                            ? '#cfcfcf'
                            : '#000'
                          : '#cfcfcf'
                      }
                    />
                    <Icon
                      icon="symbol-triangle-down"
                      size={7.5}
                      color={
                        column.isSorted
                          ? column.isSortedDesc
                            ? '#000'
                            : '#cfcfcf'
                          : '#cfcfcf'
                      }
                    />
                  </SortIcon>
                </StyledTaskTableData>
              ))}
            </StyledTableRow>
          ))}
        </StyledTableHeader>
        <StyledTableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <StyledTableRow
                {...row.getRowProps()}
                onClick={() => handleClick(row.original)}
              >
                <Icon
                  icon={
                    row.original.status === 'done'
                      ? 'tick-circle'
                      : 'circle'
                  }
                  iconSize={16}
                  className="mr3 pointer"
                  color={
                    row.original.status === 'done'
                      ? '#2EB67D'
                      : 'inherit'
                  }
                  style={{
                    cursor:
                      row.original.status === 'done'
                        ? 'no-drop'
                        : 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('clicked');
                  }}
                />
                {row.cells.map((cell) => {
                  return (
                    <StyledTaskTableData
                      cols={visibleColumns.length}
                      title={
                        cell.column.id === 'name'
                          ? cell.row.original[cell.column.id]
                          : ''
                      }
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </StyledTaskTableData>
                  );
                })}
              </StyledTableRow>
            );
          })}
        </StyledTableBody>
      </StyledTable>
      <div className="flex justify-center mt2 w-100">
        <TablePagination
          component="div"
          rowsPerPageOptions={
            window.innerHeight > 1020
              ? [10, 25, 50, 100]
              : window.innerHeight > 800
              ? [7, 10, 25, 50, 100]
              : [5, 10, 25, 50, 100]
          }
          count={rows.length}
          page={pageIndex}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

export default TasksTable;
