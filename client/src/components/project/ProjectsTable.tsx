import { useHistory } from 'react-router-dom';
import { Popover, Position } from '@blueprintjs/core';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

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
import {
  newArchiveProject,
  newDeleteProject,
  newUnarchiveProject,
} from 'stores/project/Actions';
import { successToaster } from 'components/toast/Toaster';
import ProjectButtonOptions from './ProjectButtonOptions';
import ProjectModals from './ProjectModals';

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
  userCompanyLoading: boolean;
  userId: string;
  companies: any[];
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
  const [showUpdateProject, setShowUpdateProject] =
    useState<boolean>(false);
  const [showNoSubscription, setShowNoSubscription] =
    useState<boolean>(false);
  const [showContactUsDialog, setShowContactUsDialog] =
    useState<boolean>(false);
  const [response, setResponse] = useState({
    status: 0,
    message: '',
  });
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const [companySubscriptionList, setCompanySubscriptionList] =
    useState<any[]>([]);

  const modalProps = () => {
    return {
      showArchiveProject,
      setShowArchiveProject,
      handleArchiveProject,
      showUnarchiveProject,
      setShowUnarchiveProject,
      handleUnarchiveProject,
      showUpdateProject,
      setShowUpdateProject,
      showContactUsDialog,
      setShowContactUsDialog,
      setShowNoSubscription,
      showDeleteProject,
      setShowDeleteProject,
      handleDeleteProject,
      showNoSubscription,
      setResponse,
      setShowSnackbar,
      selectedProject,
    };
  };

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
    setSelectedProject('');
    setShowPopover('');
    setShowArchiveProject(false);
  };

  const handleUnarchiveProject = () => {
    props.newUnarchiveProject({
      projectId: selectedProject._id,
      companyId: selectedProject.company._id,
    });
    setSelectedProject('');
    setShowPopover('');
    setShowUnarchiveProject(false);
  };

  const handleDeleteProject = () => {
    props.newDeleteProject({
      projectId: selectedProject._id,
      companyId: selectedProject.company._id,
    });
    setSelectedProject('');
    setShowPopover('');
    setShowDeleteProject(false);
  };

  // const handleNoSubscription = (e) => {
  //   e.stopPropagation();
  //   setShowNoSubscription(true);
  // };

  useEffect(() => {
    let data: any = [];
    if (props.companies.length > 0) {
      props.companies.forEach((company) => {
        if (company.company.isSubscribed) {
          data.push(company.company._id);
        }
      });
    }
    setCompanySubscriptionList(data);
  }, [props.companies]);

  useEffect(() => {
    if (showSnackbar) {
      if (response.status === 201) {
        successToaster(response.message);
      }
    }
  }, [showSnackbar]);

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
              <StyledTableRowContainer key={row.id} totalItems={rows.length}>
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
                  {companySubscriptionList.includes(
                    row.original.company._id,
                  ) ? (
                    <Popover
                      popoverClassName="bp3-popover-content-sizing"
                      position={Position.BOTTOM_RIGHT}
                      isOpen={
                        row.original._id === showPopover
                          ? true
                          : false
                      }
                      onClose={() => setShowPopover('')}
                      content={
                        <ProjectButtonOptions
                          setShowUpdateProject={setShowUpdateProject}
                          setShowArchiveProject={
                            setShowArchiveProject
                          }
                          setShowUnarchiveProject={
                            setShowUnarchiveProject
                          }
                          setShowDeleteProject={setShowDeleteProject}
                          setShowUpdateproject={setShowUpdateProject}
                          setSelectedProject={setSelectedProject}
                          project={row.original}
                        />
                      }
                      target={
                        <MoreVertIcon
                          fontSize="small"
                          className={
                            row.original.concernedAdmin._id ===
                              props.userId
                              ? ''
                              : 'not-allowed'
                          }
                          onClick={(e) =>
                            row.original.concernedAdmin._id ===
                              props.userId
                              ? handleOptionsClick(
                                e,
                                row.original._id,
                              )
                              : e.stopPropagation()
                          }
                        />
                      }
                    />
                  ) : null}
                </StyledTableRow>
              </StyledTableRowContainer>
            );
          })}
        </StyledTableBody>
      </StyledTable>
      {props.userCompanyLoading === false ? (
        <CreatableItem onClick={() => setOpenProjectDialog(true)}>
          <span>+</span> Create Project
        </CreatableItem>
      ) : null}
      <div className="flex justify-center mt2 w-100">
        <TablePagination
          component="div"
          rowsPerPageOptions={
            window.innerHeight > 1020
              ? rows.length >= 12
                ? [12, 25, 50, 100]
                : [rows.length, 10, 25, 50, 100]
              : window.innerHeight > 800
                ? rows.length >= 8
                  ? [8, 10, 25, 50, 100]
                  : [rows.length, 10, 25, 50, 100]
                : rows.length >= 6
                  ? [6, 10, 25, 50, 100]
                  : [rows.length, 10, 25, 50, 100]
          }
          count={rows.length}
          page={pageIndex}
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <ProjectModals modalProps={modalProps} />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  userCompanyLoading: state.userReducer.userCompanyLoading,
  userId: state.userReducer.user._id,
  companies: state.userReducer.user.companies,
});

export default connect(mapStateToProps, {
  newArchiveProject,
  newDeleteProject,
  newUnarchiveProject,
})(ProjectsTable);
