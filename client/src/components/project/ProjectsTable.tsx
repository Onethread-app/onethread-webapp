import { useHistory } from 'react-router-dom';

import { IProject } from 'stores/project/Reducer';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import TablePagination from '@material-ui/core/TablePagination';

import {
  StyledTable,
  StyledTableRow,
  StyledTableHeader,
  StyledTableBody,
  StyledProjectTableData,
  SortIcon,
  StyledTableRowContainer,
} from '../table/StyledTable.styles';

interface IProjectsTable {
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

const ProjectsTable = (props: IProjectsTable) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    page,
    gotoPage,
    pageSize,
    pageIndex,
    setPageSize,
  } = props;

  const history = useHistory();

  const handleClick = (project: IProject) => {
    history.push(
      `/company/${project.company.uniqueName}/project/${project._id}/overview`,
    );
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
  };

  const handlePageChange = (event, value) => {
    gotoPage(value);
  };

  const handleChangeRowsPerPage = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    gotoPage(0);
  };

  return (
    <>
      <StyledTable {...getTableProps()}>
        <StyledTableHeader>
          {headerGroups.map((headerGroup) => (
            <StyledTableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <StyledProjectTableData
                  cols={visibleColumns.length}
                  {...column.getHeaderProps(
                    column.getSortByToggleProps(),
                  )}
                  key={column.id}
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
                </StyledProjectTableData>
              ))}
              <MoreVertIcon fontSize="small" className={`o-0`} />
            </StyledTableRow>
          ))}
        </StyledTableHeader>
        <StyledTableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <StyledTableRowContainer key={row.id}>
                <StyledTableRow
                  {...row.getRowProps()}
                  onClick={() => handleClick(row.original)}
                >
                  {row.cells.map((cell) => (
                    <StyledProjectTableData
                      cols={visibleColumns.length}
                      title={
                        cell.column.id === 'name'
                          ? cell.row.original[cell.column.id]
                          : ''
                      }
                      {...cell.getCellProps()}
                      key={cell.column.id}
                    >
                      {cell.render('Cell')}
                    </StyledProjectTableData>
                  ))}
                  <MoreVertIcon
                    fontSize="small"
                    onClick={handleOptionsClick}
                  />
                </StyledTableRow>
              </StyledTableRowContainer>
            );
          })}
        </StyledTableBody>
      </StyledTable>
      <div className="flex justify-center mt2 w-100">
        <TablePagination
          component="div"
          rowsPerPageOptions={
            window.innerHeight > 1020
              ? [12, 25, 50, 100]
              : window.innerHeight > 800
              ? [8, 10, 25, 50, 100]
              : [6, 10, 25, 50, 100]
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

export default ProjectsTable;
