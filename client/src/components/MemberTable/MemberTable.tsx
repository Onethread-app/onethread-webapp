import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { ButtonGroup } from '@blueprintjs/core/lib/esm/components/button/buttonGroup';
import { Position } from '@blueprintjs/core/lib/esm/common/position';
import { Alignment } from '@blueprintjs/core/lib/esm/common/alignment';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow/TableRow';
import Paper from '@material-ui/core/Paper/Paper';
import TableContainer from '@material-ui/core/TableContainer/TableContainer';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import TableBody from '@material-ui/core/TableBody/TableBody';

import { companyPermit } from 'stores/UtilsActions';

import altImg from '../../resources/images/profilePhoto.svg';

import { EditDesignationForm } from 'layouts/company/colleagues/EditDesignationForm';
import { AddDesignationForm } from 'layouts/company/colleagues/AddDesignationForm';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    body: {
      fontSize: '14px',
      fontWeight: 400,
      fontFamily: 'Poppins',
    },
  }),
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(even)': {
        background: 'transparent',
      },
    },
  }),
)(TableRow);

const divisions = [
  { _id: 'director', name: 'Director' },
  { _id: 'cxo', name: 'CXO' },
  { _id: 'seniorManager', name: 'Senior Manager' },
  { _id: 'middleManager', name: 'Middle Manager' },
  { _id: 'operationalEmployee', name: 'Operational Employee' },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: '1rem 0rem',
  },
  container: {
    maxHeight: 440,
  },
  row: {
    '& > th': {
      fontWeight: 400,
      fontFamily: 'Poppins',
      background: '#E5E5E5',
      fontSize: '10px',
      lineHeight: '15px',
      color: '#666666',
    },
  },
});

export default function MemberTable({ type, props, rows }) {
  const { t } = useTranslation();
  const classes = useStyles();
  const userId = useSelector(
    (state: any) => state.userReducer.user._id,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMember, setEditMember] = useState();
  const [showDialogEdit, setShowDialogEdit] = useState(false);
  const [showDialogAdd, setShowDialogAdd] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columnsTeams = [
    { id: 'name', label: `${t('app.company.Colleagues.Name')}` },
    { id: 'email', label: `${t('app.company.Colleagues.Email')}` },
    {
      id: 'division',
      label: `${t('app.company.Colleagues.Division')}`,
    },
    {
      id: 'department',
      label: `${t('app.project.Project-teammates.Department')}`,
    },
    {
      id: 'position',
      label: `${t('app.company.Colleagues.Position')}`,
    },
    { id: 'role', label: `${t('app.company.Colleagues.Role')}` },
    { id: 'switch' },
  ];

  const columnsCollagues = [
    { id: 'name', label: `${t('app.company.Colleagues.Name')}` },
    { id: 'email', label: `${t('app.company.Colleagues.Email')}` },
    {
      id: 'division',
      label: `${t('app.company.Colleagues.Division')}`,
    },
    {
      id: 'position',
      label: `${t('app.company.Colleagues.Position')}`,
    },
    { id: 'role', label: `${t('app.company.Colleagues.Role')}` },
    { id: 'switch' },
  ];

  return (
    <>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow className={classes.row}>
                {type === 'colleagues' &&
                  columnsCollagues.map((column) => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>
                  ))}
                {type === 'teammates' &&
                  columnsTeams.map((column) => (
                    <TableCell key={column.id}>
                      {column.label}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
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
                      key={index}
                      style={{ cursor: 'pointer' }}
                    >
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align={'left'}
                      >
                        <div
                          className="items-center flex"
                          style={{ minWidth: '9rem' }}
                        >
                          {row.profileImage === null ? (
                            <img
                              src={altImg}
                              style={{
                                width: '24px',
                                height: '24px',
                                objectFit: 'contain',
                              }}
                              className="ml3"
                              alt=""
                            />
                          ) : (
                            <img
                              src={row.profileImage}
                              style={{
                                width: '24px',
                                height: '24px',
                                objectFit: 'contain',
                              }}
                              className="ml3"
                              alt=""
                            />
                          )}
                          <span className="mr2-ns mr1 f7 f6-ns pl3">
                            {row.name}
                          </span>

                          {type === 'colleagues' && (
                            <>
                              {companyPermit(row.role) ? (
                                row.role === 'superAdmin' ? (
                                  <Icon
                                    icon="star"
                                    iconSize={15}
                                    style={{
                                      color: 'rgb(228, 162, 0)',
                                      marginRight: '3px',
                                    }}
                                  />
                                ) : (
                                  <Icon
                                    icon="star"
                                    iconSize={15}
                                    className="mr1"
                                  />
                                )
                              ) : null}
                            </>
                          )}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align={'left'}
                      >
                        {row.email ? row.email : null}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.division === 'false' ? '' : row.division}
                      </StyledTableCell>
                      {type === 'teammates' && (
                        <StyledTableCell align="left">
                          {row.department === 'null'
                            ? ''
                            : row.department}
                        </StyledTableCell>
                      )}
                      <StyledTableCell align="left">
                        {row.position === 'false' ? '' : row.position}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        <span>
                          {row.role === 'admin'
                            ? 'Admin'
                            : row.role === 'projectModerator'
                            ? 'Project Moderator'
                            : row.role === 'employee'
                            ? 'Employee'
                            : row.role === 'superAdmin'
                            ? 'Super Admin'
                            : 'Member'}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {type === 'teammates' && (
                          <>
                            {row.role === 'admin' ? (
                              <>
                                {isEqual(
                                  props.companyRole,
                                  'superAdmin',
                                ) ||
                                (!isEmpty(props.projectRole) &&
                                  isEqual(
                                    props.projectRole,
                                    'admin',
                                  )) ? (
                                  <Popover
                                    className="fr"
                                    position={Position.BOTTOM}
                                    popoverClassName="bp3-popover-content bg-white"
                                    content={
                                      <ButtonGroup
                                        alignText={Alignment.LEFT}
                                        className="bp3-minimal bp3-vertical bp3-fill"
                                      >
                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                          style={{ color: 'red' }}
                                          onClick={async () => {
                                            await props.changeProjectMemberRole(
                                              {
                                                role: 'projectModerator',
                                              },
                                              row.member._id,
                                              row.member.account._id,
                                            );
                                          }}
                                        >
                                          <span>
                                            Remove from Admin
                                          </span>
                                        </Button>
                                        {userId !== row.accountId && (
                                          <Button
                                            className="outline-0 bp3-large bp3-popover-dismiss"
                                            onClick={async () => {
                                              await props.deleteTeamMember(
                                                row.id,
                                              );
                                            }}
                                          >
                                            <span className="red">
                                              Remove Member
                                            </span>
                                          </Button>
                                        )}
                                      </ButtonGroup>
                                    }
                                    target={
                                      <Icon
                                        className=" pointer"
                                        icon="drag-handle-vertical"
                                      />
                                    }
                                  />
                                ) : null}
                              </>
                            ) : row.role === 'projectModerator' ? (
                              <>
                                {isEqual(
                                  props.companyRole,
                                  'superAdmin',
                                ) ||
                                (!isEmpty(props.projectRole) &&
                                  isEqual(
                                    props.projectRole,
                                    'admin',
                                  )) ? (
                                  <Popover
                                    className="fr"
                                    position={Position.BOTTOM}
                                    popoverClassName="bp3-popover-content bg-white"
                                    content={
                                      <ButtonGroup
                                        alignText={Alignment.LEFT}
                                        className="bp3-minimal bp3-vertical bp3-fill"
                                      >
                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                          onClick={async () => {
                                            await props.changeProjectMemberRole(
                                              { role: 'admin' },
                                              row.member._id,
                                              row.member.account._id,
                                            );
                                          }}
                                        >
                                          <span>Make Admin</span>
                                        </Button>
                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                          style={{ color: 'red' }}
                                          onClick={async () => {
                                            await props.changeProjectMemberRole(
                                              { role: 'member' },
                                              row.member._id,
                                              row.member.account._id,
                                            );
                                          }}
                                        >
                                          <span>
                                            Remove from Moderator
                                          </span>
                                        </Button>

                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss"
                                          onClick={async () => {
                                            await props.deleteTeamMember(
                                              row.id,
                                            );
                                          }}
                                        >
                                          <span className="red">
                                            Remove Member
                                          </span>
                                        </Button>
                                      </ButtonGroup>
                                    }
                                    target={
                                      <Icon
                                        className=" pointer"
                                        icon="drag-handle-vertical"
                                      />
                                    }
                                  />
                                ) : null}
                              </>
                            ) : (
                              <>
                                {isEqual(
                                  props.companyRole,
                                  'superAdmin',
                                ) ||
                                (!isEmpty(props.projectRole) &&
                                  isEqual(
                                    props.projectRole,
                                    'admin',
                                  )) ? (
                                  <Popover
                                    className="fr"
                                    position={Position.BOTTOM}
                                    popoverClassName="bp3-popover-content bg-white"
                                    content={
                                      <ButtonGroup
                                        alignText={Alignment.LEFT}
                                        className="bp3-minimal bp3-vertical bp3-fill"
                                      >
                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss bp3-minimal"
                                          onClick={async () => {
                                            await props.changeProjectMemberRole(
                                              {
                                                role: 'projectModerator',
                                              },
                                              row.member._id,
                                              row.member.account._id,
                                            );
                                          }}
                                        >
                                          <span>Make Moderator</span>
                                        </Button>

                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss"
                                          onClick={async () => {
                                            await props.deleteTeamMember(
                                              row.id,
                                            );
                                          }}
                                        >
                                          <span className="red">
                                            Remove Member
                                          </span>
                                        </Button>
                                      </ButtonGroup>
                                    }
                                    target={
                                      <Icon
                                        className=" pointer"
                                        icon="drag-handle-vertical"
                                      />
                                    }
                                  />
                                ) : null}
                              </>
                            )}
                          </>
                        )}
                        {type === 'colleagues' && (
                          <>
                            {companyPermit(props.company.role) ||
                            isEqual(
                              row.m.account._id,
                              props.user._id,
                            ) ? (
                              <Popover
                                className="fr"
                                position={Position.BOTTOM}
                                popoverClassName="bp3-popover-content bg-white"
                                content={
                                  <ButtonGroup
                                    alignText={Alignment.LEFT}
                                    className="bp3-minimal bp3-vertical bp3-fill"
                                  >
                                    {row.m.designations &&
                                    row.m.designations.length ? (
                                      <Button
                                        className="outline-0 bp3-large bp3-popover-dismiss"
                                        onClick={async () => {
                                          setEditMember(row.m);
                                          await props.getAllDepartments();
                                          setShowDialogEdit(
                                            !showDialogEdit,
                                          );
                                        }}
                                      >
                                        <span>Edit Designation</span>
                                      </Button>
                                    ) : (
                                      <Button
                                        className="outline-0 bp3-large bp3-popover-dismiss"
                                        onClick={async () => {
                                          setEditMember(row.m);
                                          await props.getAllDepartments();
                                          setShowDialogAdd(
                                            !showDialogAdd,
                                          );
                                        }}
                                      >
                                        <span>Add Designation</span>
                                      </Button>
                                    )}
                                    {companyPermit(
                                      props.company.role,
                                    ) &&
                                    isEqual(
                                      row.m.role,
                                      'superAdmin',
                                    ) === false ? (
                                      isEqual(row.m.role, 'admin') ===
                                      true ? (
                                        props.company.role ===
                                          'superAdmin' ||
                                        props.company.role ===
                                          'admin' ? (
                                          <Button
                                            className="outline-0 bp3-large bp3-popover-dismiss"
                                            onClick={async () => {
                                              await props.changeMemberRole(
                                                {
                                                  role: 'employee',
                                                },
                                                row.m._id,
                                              );
                                            }}
                                          >
                                            <span className="red">
                                              Remove from Admin
                                            </span>
                                          </Button>
                                        ) : null
                                      ) : props.company.role ===
                                          'superAdmin' ||
                                        props.company.role ===
                                          'admin' ? (
                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss"
                                          onClick={async () => {
                                            await props.changeMemberRole(
                                              { role: 'admin' },
                                              row.m._id,
                                            );
                                          }}
                                        >
                                          <span>Make Admin</span>
                                        </Button>
                                      ) : null
                                    ) : null}
                                    {companyPermit(
                                      props.company.role,
                                    ) &&
                                      row.role !== 'superAdmin' &&
                                      userId !== row.accountId && (
                                        <Button
                                          className="outline-0 bp3-large bp3-popover-dismiss"
                                          onClick={async () => {
                                            await props.deleteCompanyMember(
                                              row.id,
                                            );
                                          }}
                                        >
                                          <span className="red">
                                            Remove Member
                                          </span>
                                        </Button>
                                      )}
                                  </ButtonGroup>
                                }
                                target={
                                  <Icon
                                    className=" pointer"
                                    icon="drag-handle-vertical"
                                  />
                                }
                              />
                            ) : undefined}
                          </>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {showDialogEdit && (
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
      )}
      {showDialogAdd && (
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
      )}
    </>
  );
}
