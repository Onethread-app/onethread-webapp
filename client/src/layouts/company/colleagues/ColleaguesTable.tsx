import { Dialog, Popover, Position } from '@blueprintjs/core';
import { useState } from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { companyPermit } from 'stores/UtilsActions';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import {
  addDesignation,
  changeMemberRole,
  deleteCompanyMember,
  editDesignation,
  getAllDepartments,
  getCompanyMembers,
} from 'stores/company/Actions';
import { EditDesignationForm } from './EditDesignationForm';
import { AddDesignationForm } from './AddDesignationForm';
import ColleaguesOptions from './ColleaguesOptions';

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
} from 'components/table/StyledTable.styles';
import TeammatesOptions from './TeammatesOptions';
import { AddColleaguesForm } from './AddColleaguesForm';
import { AddProjectMemberForm } from '../project/team/AddProjectMemberForm';

interface IColleaguesTable {
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

interface IColleaguesTableProps {
  company: ICompany;
  user: User;
  getCompanyMembers: () => void;
  getAllDepartments: () => void;
  addDesignation: (values: any, memberId: string) => void;
  editDesignation: (values: any, memberId: string) => void;
  changeMemberRole: (
    values: { role: string },
    memberId: string,
  ) => void;
  deleteCompanyMember: (accountId: string) => void;
  type: string;
}

const divisions = [
  { _id: 'director', name: 'Director' },
  { _id: 'cxo', name: 'CXO' },
  { _id: 'seniorManager', name: 'Senior Manager' },
  { _id: 'middleManager', name: 'Middle Manager' },
  { _id: 'operationalEmployee', name: 'Operational Employee' },
];

const ColleaguesTable = (
  props: IColleaguesTable & IColleaguesTableProps,
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
  } = props;

  const [showPopover, setShowPopover] = useState<string>('');
  const [editMember, setEditMember] = useState();
  const [showDialogEdit, setShowDialogEdit] =
    useState<boolean>(false);
  const [showDialogAdd, setShowDialogAdd] = useState<boolean>(false);
  const [showAddTeammates, setShowAddTeammates] =
    useState<boolean>(false);
  const [showAddColleagues, setShowAddColleagues] =
    useState<boolean>(false);
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

  const checkPage = (o) => {
    return props.type === 'teammates'
      ? isEqual(o.member.account._id, props.user._id)
      : isEqual(o.m.account._id, props.user._id);
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
              <StyledTableRowContainer key={row.id} totalItems={rows.length}>
                <StyledTableRow
                  {...row.getRowProps()}
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
                      row.original.id === showPopover ? true : false
                    }
                    onClose={() => setShowPopover('')}
                    content={
                      props.type === 'teammates' ? (
                        <TeammatesOptions row={row.original} />
                      ) : (
                        <ColleaguesOptions
                          row={row}
                          setEditMember={setEditMember}
                          setShowDialogEdit={setShowDialogEdit}
                          setShowDialogAdd={setShowDialogAdd}
                        />
                      )
                    }
                    target={
                      <MoreVertIcon
                        fontSize="small"
                        className={
                          companyPermit(props.company.role) ||
                            checkPage(row.original)
                            ? ''
                            : 'not-allowed'
                        }
                        onClick={(e) => {
                          companyPermit(props.company.role) ||
                            checkPage(row.original)
                            ? handleOptionsClick(e, row.original.id)
                            : e.stopPropagation();
                        }}
                      />
                    }
                  />
                </StyledTableRow>
              </StyledTableRowContainer>
            );
          })}
          {props.type === 'teammates' ? (
            <CreatableItem onClick={() => setShowAddTeammates(true)}>
              <span>+</span> Add Teammates
            </CreatableItem>
          ) : (
            <CreatableItem onClick={() => setShowAddColleagues(true)}>
              <span>+</span> Add Colleagues
            </CreatableItem>
          )}
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
      {showDialogEdit ? (
        <Dialog
          onClose={() => setShowDialogEdit(!showDialogEdit)}
          isOpen={showDialogEdit}
          style={{ background: '#fff' }}
          className="ma2"
        >
          <EditDesignationForm
            editDesignation={props.editDesignation}
            getCompanyMembers={props.getCompanyMembers}
            member={editMember}
            divisions={divisions}
            departments={props.company.departments}
            setShowDialogEdit={(e) =>
              setShowDialogEdit(!showDialogEdit)
            }
          />
        </Dialog>
      ) : null}
      {showDialogAdd ? (
        <Dialog
          onClose={() => setShowDialogAdd(!showDialogAdd)}
          isOpen={showDialogAdd}
          style={{ background: '#fff' }}
          className="ma2"
        >
          <AddDesignationForm
            addDesignation={props.addDesignation}
            getCompanyMembers={props.getCompanyMembers}
            member={editMember}
            divisions={divisions}
            departments={props.company.departments}
            setShowDialogAdd={(e) => setShowDialogAdd(!showDialogAdd)}
          />
        </Dialog>
      ) : null}
      {showAddColleagues ? (
        <Dialog
          onClose={() => setShowAddColleagues(!showAddColleagues)}
          isOpen={showAddColleagues}
          style={{ background: '#fff' }}
          className="ma2"
        >
          <AddColleaguesForm
            showDialog={showAddColleagues}
            setShowDialog={setShowAddColleagues}
          />
        </Dialog>
      ) : null}
      {showAddTeammates ? (
        <Dialog
          onClose={() => setShowAddTeammates(!showAddTeammates)}
          isOpen={showAddTeammates}
          style={{ background: '#fff' }}
          className="ma2"
        >
          <AddProjectMemberForm
            showDialog={showAddTeammates}
            setShowDialog={setShowAddTeammates}
          />
        </Dialog>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  company: state.companyReducer.currentCompany,
  user: state.userReducer.user,
});

export default connect(mapStateToProps, {
  getCompanyMembers,
  getAllDepartments,
  addDesignation,
  editDesignation,
  changeMemberRole,
  deleteCompanyMember,
})(ColleaguesTable);
