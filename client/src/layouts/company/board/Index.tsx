import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { TaskBoard } from 'stores/board/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { Color } from 'stores/UtilsActions';
import { Card, Elevation, HTMLSelect } from '@blueprintjs/core';
import { Loading } from 'components/Loading';
import { connect } from 'react-redux';
import { getAllBoards, getSelectedBoard } from 'stores/board/Actions';
import { getAllDepartments } from 'stores/company/Actions';
import { FormBoard } from './Form';
import { RightSidebar } from 'components/RightSidebar';
import { find } from 'lodash';
import { projectRules } from '../project/settings/projectrules';

import addIcon from '../../../resources/images/addIcon.png';
import { MobileView, isMobileOnly } from 'react-device-detect';
import { NavLink } from 'react-router-dom';
import { User } from 'stores/user/Reducer';
import { NavbarCompany } from 'components/NavbarCompany';

interface IBoardCardComponent {
  boardList: TaskBoard[];
  company: ICompany;
  getSelectedBoard: (boardId: string | undefined) => Promise<number>;
}

const BoardCard = withRouter(
  (props: IBoardCardComponent & RouteComponentProps) => (
    <>
      {props.boardList.map((board) => (
        <div className="pa2">
          <Card
            className="h-100"
            interactive={true}
            elevation={Elevation.TWO}
            onClick={async (e) => {
              e.preventDefault();
              const currentBoard: any = await props.getSelectedBoard(
                board._id,
              );
              if (currentBoard._id) {
                props.history.push(
                  `/company/${props.company.name}/board/${currentBoard._id}`,
                );
              }
            }}
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
                className="mt0 mb2 flex-grow-1 fw6 overflow-hidden f5"
                style={{
                  height: '2.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {board.name}
              </h3>
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
                  Total Members
                </p>
                <p className="fw8">
                  {board.members ? board.members.length : 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </>
  ),
);

interface IBoardListViewInternalProps {
  boardList: TaskBoard[];
  company: ICompany;
  getAllBoards: () => void;
  getAllDepartments: () => void;
  getSelectedBoard: (boardId: string | undefined) => Promise<number>;
  role: string;
  optionalRole: any;
  user: User;
  project: any;
}

const TaskPageComponent = (
  props: IBoardListViewInternalProps & RouteComponentProps,
) => {
  const [showTaskBoardDialog, setShowTaskBoardDialog] = useState(
    false,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      props.getAllBoards(),
      props.getAllDepartments(),
    ]).then(() => setLoading(false));
  }, []);

  const [department, setDepartment] = useState('');
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
        />{' '}
        icon below
      </p>
    </div>
  );

  return (
    <>
      <MobileView>
        <NavbarCompany title="Board" />
        <div className="flex justify-between mt5">
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Preface</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/room`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Room</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/board`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Board</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/team`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Team</small>
          </NavLink>
          <NavLink
            exact
            className="bg-black-10 pa2 ma1 br4 tc dark-gray fw6 w-25"
            to={`/company/${props.company.name}/project/${props.project._id}/settings`}
            activeStyle={{ background: '#3F61C5', color: 'white' }}
            style={{ color: 'darkGray' }}
          >
            <small style={{ color: 'inherit' }}>Settings</small>
          </NavLink>
        </div>
      </MobileView>
      <div className="h-100">
        <div className="br3 bg-white pa4-ns pa2 cf flex flex-column">
          <div className="pl2 flex-ns justify-between">
            {isMobileOnly ? undefined : (
              <h3 className="f3 mt2 lh-title tigrow-lightGray-1 dib">
                Board
              </h3>
            )}
            <div className="flex">
              <p className="pr3 fw7" style={{ marginTop: '.8rem' }}>
                Filter By
              </p>
              <div className="mt2" style={{ width: '200px' }}>
                <HTMLSelect
                  fill={true}
                  minimal={true}
                  onChange={(event: any) => {
                    setDepartment(event.currentTarget.value);
                  }}
                  style={{
                    outline: 'none',
                    border: '1px solid #E1E1E1',
                    fontWeight: 600,
                    textAlignLast: 'center',
                  }}
                >
                  <option selected value="">
                    All
                  </option>
                  {props.company.departments
                    ? props.company.departments.map((d) => (
                        <option value={d._id}>{d.name}</option>
                      ))
                    : undefined}
                </HTMLSelect>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-auto pa4-ns pa2">
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
                  />
                ) : (
                  <BoardCard
                    boardList={props.boardList}
                    company={props.company}
                    getSelectedBoard={props.getSelectedBoard}
                  />
                )}
              </div>
            ) : (
              noBoardsFound
            )
          ) : (
            <Loading />
          )}
          <div>
            {props.role &&
            (props.role === 'admin' ||
              projectRules(props.optionalRole)[props.role].includes(
                'createUpdateBoard',
              )) ? (
              <img
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
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    boardList: state.boardIndexReducer.boardReducer.boardList,
    company: state.companyReducer.currentCompany,
    role:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.role,
    optionalRole:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.project.optionalRole,
    user: state.userReducer.user,
    project: state.projectReducer.projectDetails,
  };
};

export const BoardPage = connect(mapStateToProps, {
  getAllBoards,
  getSelectedBoard,
  getAllDepartments,
})(withRouter(TaskPageComponent));
