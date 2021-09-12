import {
  Button,
  ButtonGroup,
  Card,
  Dialog,
  Elevation,
  Menu,
  MenuItem,
  Popover,
} from '@blueprintjs/core';
import Axios from 'axios';
import { Loading } from 'components/Loading';
import { NavbarCompany } from 'components/NavbarCompany';
import { RightSidebar } from 'components/RightSidebar';
import { server } from 'config';
import { find } from 'lodash';
import React, { useEffect, useState } from 'react';
import { isMobileOnly, MobileView } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import {
  clearCurrentBoard,
  getAllBoards,
  getSelectedBoard,
} from 'stores/task/Actions';
import { TaskBoard } from 'stores/task/Reducer';
import { getAllDepartments } from 'stores/company/Actions';
import { ICompany } from 'stores/company/Reducer';
import { User } from 'stores/user/Reducer';
import { Color, tokenConfig } from 'stores/UtilsActions';
import addIcon from '../../../resources/images/addIcon.png';
import { projectRules } from '../project/settings/projectrules';
import { FormBoard } from './Form';
import { UpdateFormBoard } from './UpdateForm';

interface IBoardCardComponent {
  boardList: TaskBoard[];
  company: ICompany;
  getSelectedBoard: (boardId: any) => void;
  handleDialogChange: (boardId: any) => void;
  handleUpdate: (boardId) => void;
  currentBoard: TaskBoard;
  errorOnFetchingBoard: string;
  fetchingBoard: boolean;
  singleProjectLoading: boolean;
  setSingleBoardLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

interface IBoardListViewInternalProps extends IBoardCardComponent {
  getAllBoards: () => void;
  getAllDepartments: () => void;
  clearCurrentBoard: () => void;
  handleDialogChange: (boardId: any) => void;
  handleUpdate: (boardId) => void;
  role: string;
  optionalRole: any;
  user: User;
  project: any;
  fetchingBoards: boolean;
  boardError: string;
  departmentNameLoading: boolean;
}

const BoardCard = withRouter(
  (props: IBoardCardComponent & RouteComponentProps) => {
    const { t } = useTranslation();
    return (
      <>
        {props.boardList.map((board) => (
          <div className="pa2">
            <Card
              className="h-100"
              interactive={true}
              elevation={Elevation.TWO}
              style={{ paddingLeft: '0px', paddingBottom: '0px' }}
            >
              <div
                className="flex"
                style={{
                  borderLeft: `5px solid 
							${
                find(Color, ['code', board.color])
                  ? find(Color, ['code', board.color])!.value
                  : 'white'
              }`, // TODO use dictionary
                  paddingLeft: '20px',
                  marginLeft: '-2px',
                  borderRadius: '3px',
                }}
              >
                <h3
                  className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f4 hover-dark-blue pointer"
                  style={{
                    height: '2.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                  onClick={async (e) => {
                    e.preventDefault();
                    await props.getSelectedBoard(board._id);
                    props.setSingleBoardLoading(true);
                  }}
                >
                  {board.name}
                </h3>
                <Popover
                  className="w-10"
                  content={
                    <Menu className="pa2">
                      <MenuItem
                        className="pa1 red"
                        text={t(
                          'app.project.Project-boards.Update-Board',
                        )}
                        // text="Update Board"
                        onClick={() => props.handleUpdate(board)}
                      />
                      <MenuItem
                        className="pa1 red"
                        text={t(
                          'app.project.Project-boards.Delete-Board',
                        )}
                        // text="Delete Board"
                        onClick={() =>
                          props.handleDialogChange(board._id)
                        }
                      />
                    </Menu>
                  }
                  target={
                    <Button
                      style={{
                        transform: 'rotate(90deg)',
                        OTransform: 'rotate(90deg)',
                        msTransform: 'rotate(90deg)',
                        WebkitTransform: 'rotate(90deg)',
                      }}
                      icon="more"
                      minimal={true}
                      className="outline-0"
                    />
                  }
                />
              </div>
              <div
                className="flex pt3 pr3"
                style={{
                  justifyContent: 'space-between',
                  paddingLeft: '20px',
                }}
              >
                <div>
                  <p
                    className="mb0 ws-break"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {t('app.project.Project-boards.Total-Members')}
                    {/* Total Members */}
                  </p>
                  <p className="fw8">
                    {board.members ? board.members.length : 0}
                  </p>
                </div>
                <div>
                  <p
                    className="mb0 ws-break"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {t('app.project.Project-boards.Remaining-Tasks')}
                    {/* Remaining Tasks */}
                  </p>
                  <p className="fw8">
                    {`${board.remainingTasks}/${board.totalTasks}`}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </>
    );
  },
);

const TaskPageComponent = (
  props: IBoardListViewInternalProps & RouteComponentProps,
) => {
  const [showTaskBoardDialog, setShowTaskBoardDialog] = useState(
    false,
  );
  const [updTaskBoardDialog, setUpdTaskBoardDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [singleBoardLoading, setSingleBoardLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogBoardId, setDialogBoardId] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);

  const permissions = projectRules(props.role, props.optionalRole);

  const handleUpdate = (board) => {
    setSelectedBoard(board);
    setUpdTaskBoardDialog(!updTaskBoardDialog);
  };
  const handleDialogChange = (bid = null) => {
    if (showDialog) setDialogBoardId(null);
    else setDialogBoardId(bid);

    setShowDialog((prev) => !prev);
  };

  const getAllBoardsAndDepts = async () => {
    Promise.all([
      props.getAllBoards(),
      props.getAllDepartments(),
    ]).then(() => {
      if (
        props.fetchingBoards === false &&
        props.departmentNameLoading === false
      ) {
        setLoading(false);
      }
    });
  };

  const handleDeleteDialog = async (bid) => {
    setDialogBoardId(null);
    setShowDialog((prev) => !prev);
    if (permissions.grantAll) {
      const headers = tokenConfig();
      try {
        await Axios.post(
          `${server}/boards/delete`,
          { boardId: bid },
          headers,
        );
        props.clearCurrentBoard();
        getAllBoardsAndDepts();
      } catch (e) {}
    }
  };

  useEffect(() => {
    props.clearCurrentBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllBoardsAndDepts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.project._id]);

  useEffect(() => {
    if (
      loading === true &&
      props.fetchingBoards === false &&
      props.departmentNameLoading === false &&
      props.boardError === ''
    ) {
      setLoading(false);
    }
  }, [
    loading,
    props.boardError,
    props.departmentNameLoading,
    props.fetchingBoards,
  ]);

  useEffect(() => {
    const forwardToGeneral = () => {
      props.getSelectedBoard(props.boardList[0]._id);
      setSingleBoardLoading(true);
    };
    if (
      loading === false &&
      props.boardList &&
      props.boardList.length === 1 &&
      props.boardList[0].name.toLowerCase() === 'general'
    ) {
      forwardToGeneral();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.boardList, loading]);

  useEffect(() => {
    if (
      singleBoardLoading === true &&
      props.fetchingBoard === false &&
      props.errorOnFetchingBoard === '' &&
      props.currentBoard._id
    ) {
      setSingleBoardLoading(false);
      props.history.push(
        `/company/${props.company.uniqueName}/project/${props.project._id}/board/${props.currentBoard._id}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.fetchingBoard,
    singleBoardLoading,
    props.errorOnFetchingBoard,
    props.currentBoard._id,
  ]);

  const [department] = useState('');
  const boards = props.boardList.filter(
    (board) => board.department === department,
  );

  const noBoardsFound = (
    <div
      onClick={() => setShowTaskBoardDialog(true)}
      className="tc pointer dim"
    >
      <h1 style={{ color: '#34495E' }}>No Boards Found</h1>
      <p
        className="f5-l f4-ns f6 tc"
        style={{ color: '#85929E', display: 'inline-block' }}
      >
        Click here to create a board or click on the{' '}
        <img
          src={addIcon}
          style={{
            display: 'inline-block',
            height: '20px',
          }}
          alt=""
        />{' '}
        icon below
      </p>
    </div>
  );

  const { t } = useTranslation();

  return (
    <>
      <MobileView>
        <NavbarCompany
          title={t('app.project.Project-boards.Board')}
        />
        {/* <NavbarCompany title="Board" /> */}
        <div className="flex justify-between mt5">
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/overview`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.company.Projects.Overview')}
            </small>
            {/* <small style={{ color: 'inherit' }}>Overview</small> */}
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-preface.Intro')}
            </small>
            {/* <small style={{ color: 'inherit' }}>Preface</small> */}
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/room`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Room</small>
            {/* <small style={{ color: 'inherit' }}>Room</small> */}
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/board`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-boards.Board')}
            </small>
            {/* <small style={{ color: 'inherit' }}>Boards</small> */}
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/team`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.project.Project-teammates.Team-members')}
            </small>
            {/* <small style={{ color: 'inherit' }}>Teammates</small> */}
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.uniqueName}/project/${props.project._id}/settings`}
            activeStyle={{ background: '#34b3e9', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>
              {t('app.company.Projects.Project-Settings')}
              {/* Project Settings */}
            </small>
          </NavLink>
        </div>
      </MobileView>
      <div className="h-100">
        <div className="br3 bg-white h-100 pa4-ns pa2 cf flex flex-column">
          <div className="pl2 flex-ns justify-between">
            {isMobileOnly ? undefined : (
              <h3 className="f3 mt2 lh-title tigrow-lightGray-1 dib">
                {t('app.project.Project-boards.Board')}
                {/* Board */}
              </h3>
            )}
          </div>
          <p
            className="pl2 mt3"
            style={{ color: '#6B6B6B', fontSize: '18px' }}
          >
            {t('app.project.Project-boards.My-boards')}
            {/* My Boards */}
          </p>
          <div className="overflow-auto">
            {loading === false ? (
              props.boardList.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(200px, 270px))',
                    gridTemplateRows: 'repeat(2, 150px)',
                  }}
                >
                  {/* TODO make one */}
                  {department ? (
                    <BoardCard
                      boardList={boards}
                      company={props.company}
                      getSelectedBoard={props.getSelectedBoard}
                      currentBoard={props.currentBoard}
                      errorOnFetchingBoard={
                        props.errorOnFetchingBoard
                      }
                      fetchingBoard={props.fetchingBoard}
                      singleProjectLoading={
                        props.singleProjectLoading
                      }
                      setSingleBoardLoading={setSingleBoardLoading}
                      handleDialogChange={handleDialogChange}
                      handleUpdate={handleUpdate}
                    />
                  ) : (
                    <BoardCard
                      boardList={props.boardList}
                      company={props.company}
                      getSelectedBoard={props.getSelectedBoard}
                      currentBoard={props.currentBoard}
                      errorOnFetchingBoard={
                        props.errorOnFetchingBoard
                      }
                      fetchingBoard={props.fetchingBoard}
                      singleProjectLoading={
                        props.singleProjectLoading
                      }
                      setSingleBoardLoading={setSingleBoardLoading}
                      handleDialogChange={handleDialogChange}
                      handleUpdate={handleUpdate}
                    />
                  )}
                </div>
              ) : props.role &&
                (permissions.grantAll ||
                  permissions.projectModerator.includes(
                    'createUpdateBoard',
                  )) ? (
                noBoardsFound
              ) : undefined
            ) : (
              <Loading />
            )}
            <div>
              {props.role &&
              (permissions.grantAll ||
                permissions.projectModerator.includes(
                  'createUpdateBoard',
                )) ? (
                <img
                  alt="plus"
                  onClick={() =>
                    setShowTaskBoardDialog(!showTaskBoardDialog)
                  }
                  src={addIcon}
                  className={`fixed pointer ${
                    showTaskBoardDialog ? 'dn' : 'db'
                  }`}
                  style={{
                    bottom: '5rem',
                    right: '7rem',
                    width: '5rem',
                    boxShadow: '0px 6px 6px #00000029',
                    borderRadius: '50%',
                  }}
                />
              ) : undefined}
            </div>
            {showTaskBoardDialog && (
              <RightSidebar
                onClose={() =>
                  setShowTaskBoardDialog(!showTaskBoardDialog)
                }
              >
                <FormBoard
                  setShowTaskBoardDialog={setShowTaskBoardDialog}
                />
              </RightSidebar>
            )}

            {updTaskBoardDialog && (
              <RightSidebar
                onClose={() =>
                  setShowTaskBoardDialog(!updTaskBoardDialog)
                }
              >
                <UpdateFormBoard
                  setShowTaskBoardDialog={setUpdTaskBoardDialog}
                  selectedBoard={selectedBoard}
                />
              </RightSidebar>
            )}
          </div>
        </div>
      </div>
      <Dialog
        isOpen={showDialog}
        style={{ paddingBottom: '0' }}
        canOutsideClickClose={true}
      >
        <div
          className="w-100 ba bw1 br2 pa3"
          style={{ borderColor: '#F55B7F' }}
        >
          <h4 style={{ marginBottom: 13 }}>
            {/* Delete Board */}
            {t('app.project.Project-boards.Delete-Board')}
          </h4>
          {/* <h4 style={{ marginBottom: 13 }}>Delete Board</h4> */}
          <p style={{ marginBottom: 10 }}>
            {t('app.project.Project-boards.Delete-text')}
            {/* Are you sure you want to delete this board? */}
          </p>
          <ButtonGroup
            minimal={true}
            style={{ display: 'flex', flexDirection: 'row-reverse' }}
          >
            <Button
              icon="trash"
              intent="danger"
              onClick={() => handleDeleteDialog(dialogBoardId)}
            >
              {t('app.project.Project-boards.Yes-delete')}
              {/* Yes. Delete */}
            </Button>
            <Button
              icon="undo"
              onClick={() => handleDialogChange()}
              intent="primary"
            >
              {t('app.project.Project-boards.Keep')}
              {/* No. Keep it */}
            </Button>
          </ButtonGroup>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    boardList: state.taskIndexReducer.taskReducer.boardList,
    company: state.companyReducer.currentCompany,
    departmentNameLoading: state.companyReducer.departmentNameLoading,
    role:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.role,
    optionalRole:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.project.optionalRole,
    user: state.userReducer.user,
    project: state.projectReducer.projectDetails,
    singleProjectLoading: state.projectReducer.singleProjectLoading,
    currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
    fetchingBoards: state.taskIndexReducer.taskReducer.fetchingBoards,
    boardError: state.taskIndexReducer.taskReducer.boardError,
    fetchingBoard: state.taskIndexReducer.taskReducer.fetchingBoard,
    errorOnFetchingBoard:
      state.taskIndexReducer.taskReducer.errorOnFetchingBoard,
  };
};

export const BoardPage = connect(mapStateToProps, {
  getSelectedBoard,
  getAllBoards,
  getAllDepartments,
  clearCurrentBoard,
})(withRouter(TaskPageComponent));

export default BoardPage;
