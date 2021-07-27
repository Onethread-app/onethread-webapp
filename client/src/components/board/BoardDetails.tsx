import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import ColumnsContainer from 'components/column/ColumnsContainer';
import TaskList from 'components/task/TaskList';
import MemberGroup from 'components/member/MemberGroup';

import { ICompany } from 'stores/company/Reducer';
import { TaskBoard } from 'stores/board/Reducer';
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
  display: none;
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

interface IBoardDetails {
  company: ICompany;
  currentBoard: TaskBoard;
  currentProject: IProject;
}

const BoardDetails = (props: IBoardDetails) => {
  const [view, setView] = useState<'board' | 'list'>('board');

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
                onClick={() => setView('list')}
                className={`${view === 'list' && 'active'}`}
              >
                List
              </p>

              <p
                onClick={() => setView('board')}
                className={`${view === 'board' && 'active'}`}
              >
                Board
              </p>
            </ViewSelectDiv>
          </div>
          <div className="flex justify-end">
            <SortingDiv className="flex items-center justify-between">
              <p className="mr2">
                Sort By <span>Due Date</span>
              </p>
              <p className="mr2">
                Sort By <span>Priority</span>
              </p>
              <p className="mr2">
                Sort By <span>Asignee</span>
              </p>
            </SortingDiv>
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

export default connect(mapStateToProps)(BoardDetails);
