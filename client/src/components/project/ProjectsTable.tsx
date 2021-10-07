import { useHistory } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';

import { IProject } from 'stores/project/Reducer';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import Pagination from '@material-ui/lab/Pagination/Pagination';

import {
  StyledTable,
  StyledTableRow,
  StyledTableHeader,
  StyledTableBody,
  StyledProjectTableData,
  SortIcon,
} from '../table/StyledTable.styles';

interface IProjectsTable {
  getTableProps: any;
  getTableBodyProps: any;
  headerGroups: any;
  rows: any;
  prepareRow: any;
  visibleColumns: any;
  page: any;
  pageOptions: any;
  gotoPage: any;
  pageSize: any;
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
    pageOptions,
    gotoPage,
    pageSize,
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
    gotoPage(value - 1);
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
                  >
                    {cell.render('Cell')}
                  </StyledProjectTableData>
                ))}
                <MoreVertIcon
                  fontSize="small"
                  onClick={handleOptionsClick}
                />
              </StyledTableRow>
            );
          })}
        </StyledTableBody>
      </StyledTable>
      {rows.length > pageSize && (
        <div className="flex justify-center mt2 w-100">
          <Pagination
            count={pageOptions.length}
            onChange={handlePageChange}
            siblingCount={0}
            showFirstButton={pageOptions.length > 3}
            showLastButton={pageOptions.length > 3}
            size={isMobileOnly ? 'small' : 'medium'}
          />
        </div>
      )}
    </>
  );
};

export default ProjectsTable;
