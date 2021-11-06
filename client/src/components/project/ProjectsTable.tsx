import { useHistory } from 'react-router-dom';
import { Dialog, Popover, Position } from '@blueprintjs/core';
import { useState } from 'react';

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
  CreatableItem,
} from '../table/StyledTable.styles';
import { connect } from 'react-redux';
import {
  newArchiveProject,
  newDeleteProject,
  newUnarchiveProject,
} from 'stores/project/Actions';
import {
  DangerButton,
  SimpleButton,
  // SuccessButton,
  Container,
  List,
} from './Project.styles';

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
  setOpenProjectDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProjectsFunctions {
  newArchiveProject: ({ projectId, companyId }) => void;
  newDeleteProject: ({ projectId, companyId }) => void;
  newUnarchiveProject: ({ projectId, companyId }) => void;
}

const ProjectsTable = (
  props: IProjectsTable & IProjectsFunctions,
) => {
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
    setOpenProjectDialog,
  } = props;

  const history = useHistory();
  const [showPopover, setShowPopover] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<any>('');
  const [showArchiveProject, setShowArchiveProject] =
    useState<boolean>(false);
  const [showUnarchiveProject, setShowUnarchiveProject] =
    useState<boolean>(false);
  const [showDeleteProject, setShowDeleteProject] =
    useState<boolean>(false);

  const handleClick = (project: IProject) => {
    history.push(
      `/company/${project.company.uniqueName}/project/${project._id}`,
    );
  };

  const handleOptionsClick = (e, id) => {
    setShowPopover(id);
    e.stopPropagation();
  };

  const handlePageChange = (event, value) => {
    gotoPage(value);
  };

  const handleChangeRowsPerPage = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    gotoPage(0);
  };

  const handleArchiveProject = () => {
    props.newArchiveProject({
      projectId: selectedProject._id,
      companyId: selectedProject.company._id,
    });
    setShowArchiveProject(false);
  };

  const handleUnarchiveProject = () => {
    props.newUnarchiveProject({
      projectId: selectedProject._id,
      companyId: selectedProject.company._id,
    });
    setShowUnarchiveProject(false);
  };

  const handleDeleteProject = () => {
    props.newDeleteProject({
      projectId: selectedProject._id,
      companyId: selectedProject.company._id,
    });
    setShowDeleteProject(false);
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
                  className="row"
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
                  <Popover
                    popoverClassName="bp3-popover-content-sizing"
                    position={Position.BOTTOM_RIGHT}
                    isOpen={
                      row.original._id === showPopover ? true : false
                    }
                    onClose={() => setShowPopover('')}
                    content={
                      <div className="flex flex-column">
                        {/* <List
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowUpdateProject(true);
                            setSelectedProject(row.original);
                          }}
                        >
                          Edit
                        </List> */}
                        {row.original.status === 'archived' ? (
                          <List
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(row.original);
                              setShowUnarchiveProject(true);
                            }}
                          >
                            Unarchive
                          </List>
                        ) : (
                          <List
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(row.original);
                              setShowArchiveProject(true);
                            }}
                          >
                            Archive
                          </List>
                        )}
                        <List
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(row.original);
                            setShowDeleteProject(true);
                          }}
                          className="mt1"
                        >
                          Delete
                        </List>
                      </div>
                    }
                    target={
                      <MoreVertIcon
                        fontSize="small"
                        onClick={(e) =>
                          handleOptionsClick(e, row.original._id)
                        }
                      />
                    }
                  />
                </StyledTableRow>
              </StyledTableRowContainer>
            );
          })}
        </StyledTableBody>
      </StyledTable>
      <CreatableItem onClick={() => setOpenProjectDialog(true)}>
        <span>+</span> Create Project
      </CreatableItem>
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
      {showArchiveProject ? (
        <Dialog
          isOpen={showArchiveProject}
          onClose={() => setShowArchiveProject(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0"
        >
          <Container>
            <div>Do you want to archive this project?</div>
            <div className="w-100 flex justify-center">
              <DangerButton
                className="mr2"
                onClick={handleArchiveProject}
              >
                Yes
              </DangerButton>
              <SimpleButton
                className="ml2"
                onClick={() => {
                  setShowArchiveProject(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </Container>
        </Dialog>
      ) : null}
      {showUnarchiveProject ? (
        <Dialog
          isOpen={showUnarchiveProject}
          onClose={() => setShowUnarchiveProject(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0"
        >
          <Container>
            <div>Do you want to unarchive this project?</div>
            <div className="w-100 flex justify-center">
              <DangerButton
                className="mr2"
                onClick={handleUnarchiveProject}
              >
                Yes
              </DangerButton>
              <SimpleButton
                className="ml2"
                onClick={() => {
                  setShowUnarchiveProject(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </Container>
        </Dialog>
      ) : null}
      {showDeleteProject ? (
        <Dialog
          isOpen={showDeleteProject}
          onClose={() => setShowDeleteProject(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="pb0"
        >
          <Container>
            <div>
              This will delete everything of this project including
              all it's tasks, subtasks, and rooms. Do you still want
              to proceed?
            </div>
            <div className="w-100 flex justify-center">
              <DangerButton
                className="mr2"
                onClick={handleDeleteProject}
              >
                Yes
              </DangerButton>
              <SimpleButton
                className="ml2"
                onClick={() => {
                  setShowDeleteProject(false);
                }}
              >
                Cancel
              </SimpleButton>
            </div>
          </Container>
        </Dialog>
      ) : null}
    </>
  );
};

const mapStateToProps = (state: any) => ({});

export default connect(mapStateToProps, {
  newArchiveProject,
  newDeleteProject,
  newUnarchiveProject,
})(ProjectsTable);
