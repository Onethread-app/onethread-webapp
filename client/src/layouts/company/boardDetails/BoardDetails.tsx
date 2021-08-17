import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { Icon, Popover } from '@blueprintjs/core';

import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import ColumnsContainer from 'components/column/ColumnsContainer';
import TaskList from 'components/task/TaskList';
import MemberGroup from 'components/member/MemberGroup';
import MultiSelectComponent from 'components/dashboard/project-status/MultiSelectComponent';

import { ICompany } from 'stores/company/Reducer';
import {
  IFilterUser,
  SortTasksBy,
  TaskBoard,
} from 'stores/board/Reducer';
import { setSortBy, setFilerUsers } from 'stores/board/Actions';
import { IProject } from 'stores/project/Reducer';

const Container = styled.div`
  background: #fff;
  font-family: 'Poppins', sans-serif;
`;

const ProjectName = styled.h3`
  font-size: 28.9886px;
  font-weight: 500;
  line-height: 150%;
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #323030;
`;

const SortingDiv = styled.div`
  display: flex;
  width: fit-content;
  color: #a4a4a4;
  font-size: 12px;
  font-weight: 600;
  line-height: 150%;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  p {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  span {
    color: #656565;
    cursor: pointer;
  }
`;

const ViewSelectDiv = styled.div`
  width: fit-content;
  gap: 0.5rem;
  color: #a4a4a4;
  font-size: 12px;
  font-weight: 600;
  line-height: 150%;
  padding: 0.25rem 1rem;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  p {
    color: #656565;
    margin-bottom: 0;
    border-radius: 4px;
    padding: 0.25rem 0;

    &:not(:first-child) {
      cursor: pointer;
      padding: 0.25rem 0.5rem;
    }

    &.active {
      background: #e5e5e5;
      color: #182026;
    }
  }
`;

const TasksNumber = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;

  h3 {
    font-weight: 600;
    font-size: 24px;
    line-height: 36px;
    color: #323030;
    margin: 0;
  }

  span {
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: #000000;
  }
`;

const SecondaryHeader = styled.div`
  > div {
    width: calc(100% / 3);
  }
`;

interface ISelectedAssignee {
  id: string;
  label: string;
}

interface IBoardDetails {
  company: ICompany;
  currentBoard: TaskBoard;
  currentProject: IProject;
  setSortBy: (sort: SortTasksBy) => void;
  setFilerUsers: (list: IFilterUser[]) => void;
}

const BoardDetails = (props: IBoardDetails) => {
  const [view, setView] = useState<'board' | 'list'>('list');
  const [boardMembers, setBoardMembers] = useState<
    ISelectedAssignee[]
  >([]);
  const [selectedAssignee, setSelectedAssignee] = useState<
    ISelectedAssignee[]
  >([]);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const { t } = useTranslation();

  const clearSort = () => {
    props.setSortBy(undefined);
    setFilterPopoverOpen(false);
    setSelectedAssignee([]);
  };

  useEffect(() => {
    setBoardMembers(
      props.currentBoard.members.map((member) => {
        return {
          id: member._id,
          label: `${member.firstName} ${member.lastName}`,
        };
      }),
    );
  }, [props.currentBoard]);

  useEffect(() => {
    props.setFilerUsers(selectedAssignee);
    props.setSortBy(undefined);
  }, [selectedAssignee]);

  return (
    <Container className="h-100 ph3 cf flex flex-column">
      <div className="flex flex-column mb3">
        <div className="flex justify-between">
          <div
            className="flex flex-column"
            style={{ width: 'calc(100%/3)' }}
          >
            <BreadCrumbs
              items={[
                {
                  text: `Board`,
                  href: `/company/${
                    props.company.uniqueName
                  }/project/${props.currentProject!._id}/board`,
                },
                {
                  text: `${props.currentBoard.name}`,
                  href: `/company/${props.company.uniqueName}/project/${props.currentProject._id}/board/${props.currentBoard._id}`,
                },
              ]}
            />
          </div>
          <ProjectName
            className="tc"
            style={{ width: 'calc(100%/3)' }}
          >
            {props.currentProject.name}
          </ProjectName>
          <div
            className="flex justify-end"
            style={{ width: 'calc(100%/3)' }}
          >
            <MemberGroup members={props.currentBoard.members} />
          </div>
        </div>
        <SecondaryHeader className="flex items-center">
          <div>
            <TasksNumber>
              <h3>Tasks</h3>
              <span>
                (
                {
                  props.currentBoard.columns
                    .map((col) => col.tasks)
                    .flat().length
                }
                )
              </span>
            </TasksNumber>
          </div>
          <div className="flex justify-center">
            <ViewSelectDiv className="flex">
              <p>View:</p>
              <p
                onClick={() => {
                  clearSort();
                  setView('list');
                }}
                className={`${view === 'list' && 'active'}`}
              >
                List
              </p>

              <p
                onClick={() => {
                  clearSort();
                  setView('board');
                }}
                className={`${view === 'board' && 'active'}`}
              >
                Board
              </p>
            </ViewSelectDiv>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center">
              {(props.currentBoard.sortBy !== undefined ||
                selectedAssignee.length > 0) && (
                <ClearOutlinedIcon
                  className="mr2 pointer grow ba br2"
                  style={{ color: '#656565', borderColor: '#656565' }}
                  onClick={clearSort}
                />
              )}
              <SortingDiv className="flex items-center justify-between">
                <Popover
                  interactionKind="click"
                  position="bottom"
                  popoverClassName="bg-white"
                  content={
                    <div className="bg-white ma3">
                      <p className="mr2 flex items-center">
                        Sort By{' '}
                        <span
                          onClick={() => props.setSortBy('dueDate')}
                          className="pointer ml2"
                        >
                          Due Date
                        </span>
                        {props.currentBoard.sortBy === 'dueDate' && (
                          <Icon
                            iconSize={12}
                            icon={
                              props.currentBoard.orderBy === 'asc'
                                ? 'arrow-up'
                                : 'arrow-down'
                            }
                          />
                        )}
                      </p>
                      <p className="mr2 flex items-center">
                        Sort By{' '}
                        <span
                          onClick={() => props.setSortBy('priority')}
                          className="pointer ml2"
                        >
                          Priority
                        </span>
                        {props.currentBoard.sortBy === 'priority' && (
                          <Icon
                            iconSize={12}
                            icon={
                              props.currentBoard.orderBy === 'asc'
                                ? 'arrow-up'
                                : 'arrow-down'
                            }
                          />
                        )}
                      </p>
                    </div>
                  }
                  target={
                    <div className="flex items-center mr3">
                      <Icon
                        icon="sort-desc"
                        className="mr1"
                        iconSize={12}
                      />
                      <p>Sort</p>
                    </div>
                  }
                />
                <Popover
                  isOpen={filterPopoverOpen}
                  interactionKind="click"
                  position="bottom"
                  popoverClassName="bg-white"
                  content={
                    <div
                      className="pa2"
                      style={{
                        minWidth: '180px',
                        width: '200px',
                        maxWidth: '250px',
                      }}
                    >
                      <div className="flex items-center justify-between mb2">
                        <p className="ma0">Assignee</p>
                        <span
                          className="bp3-tag pointer bg-light-gray black"
                          onClick={() => setFilterPopoverOpen(false)}
                        >
                          Close
                        </span>
                      </div>
                      <MultiSelectComponent
                        container={boardMembers}
                        placeholder={t(
                          'app.project.Tasks.Filter-assignee',
                        )}
                        selected={selectedAssignee}
                        setSelected={setSelectedAssignee}
                      />
                    </div>
                  }
                  target={
                    <div
                      className="mr2 flex items-center"
                      onClick={() =>
                        setFilterPopoverOpen(!filterPopoverOpen)
                      }
                    >
                      <Icon
                        icon="filter"
                        className="mr1"
                        iconSize={12}
                      />
                      <p>Filter</p>
                    </div>
                  }
                />
              </SortingDiv>
            </div>
          </div>
        </SecondaryHeader>
      </div>

      {view === 'board' ? (
        <ColumnsContainer />
      ) : view === 'list' ? (
        <TaskList />
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  company: state.companyReducer.currentCompany,
  currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
  currentProject: state.projectReducer.projectDetails,
});

export default connect(mapStateToProps, { setSortBy, setFilerUsers })(
  BoardDetails,
);
