import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isMobileOnly } from 'react-device-detect';
import { connect } from 'react-redux';

import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import ListIcon from '@material-ui/icons/List';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import DateRangeIcon from '@material-ui/icons/DateRange';

import {
  IFilterUser,
  SortTasksBy,
  TaskBoard,
} from 'stores/task/Reducer';
import { IProject } from 'stores/project/Reducer';
import { ICompany } from 'stores/company/Reducer';
import {
  setSortBy,
  setFilerUsers,
  setPreferredView,
} from 'stores/task/Actions';

import CalendarView, {
  ITaskForCalendar,
} from 'components/calendar/CalendarView';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import ColumnsContainer from 'components/column/ColumnsContainer';
import TaskList from 'components/task/TaskList';
import MemberGroup from 'components/member/MemberGroup';
import MultiSelectComponent from 'components/dashboard/project-status/MultiSelectComponent';
import CreateTaskButton from 'components/task/CreateTaskButton';
import PriorityColorList from 'components/task/PriorityColorList';

import {
  Container,
  ProjectName,
  SecondaryHeader,
  SortingDiv,
  TasksNumber,
  ViewSelectDiv,
} from './BoardDetails.styles';

interface ISelectedAssignee {
  id: string;
  label: string;
}

interface IBoardDetails {
  fetchingBoard: boolean;
  company: ICompany;
  currentBoard: TaskBoard;
  currentProject: IProject;
  setSortBy: (sort: SortTasksBy) => void;
  setFilerUsers: (list: IFilterUser[]) => void;
  setPreferredView: (v: 'board' | 'list' | 'calendar') => void;
}

const BoardDetails = (props: IBoardDetails) => {
  const { t } = useTranslation();
  const [view, setView] = useState<'board' | 'list' | 'calendar'>(
    props.currentBoard.preferredView ?? 'list',
  );
  const [boardMembers, setBoardMembers] = useState<
    ISelectedAssignee[]
  >([]);
  const [selectedAssignee, setSelectedAssignee] = useState<
    ISelectedAssignee[]
  >([]);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const [todoColumnId, setTodoColumnId] = useState('');
  const [tasksForCalendarView, setTasksForCalendarView] = useState<
    ITaskForCalendar[]
  >([]);

  const clearSort = () => {
    props.setSortBy(undefined);
    setFilterPopoverOpen(false);
    setSelectedAssignee([]);
  };

  const handleViewChange = (v: 'board' | 'list' | 'calendar') => {
    if (props.fetchingBoard === false) {
      clearSort();
      setView(v);
      props.setPreferredView(v);
    }
  };

  useEffect(() => {
    props.setFilerUsers(selectedAssignee);
    props.setSortBy(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAssignee]);

  useEffect(() => {
    setBoardMembers(
      props.currentBoard.members.map((member) => {
        return {
          id: member._id,
          label: `${member.firstName} ${member.lastName}`,
        };
      }),
    );
    if (props.currentBoard.columns.length > 0)
      setTodoColumnId(
        props.currentBoard.columns.filter(
          (col) => col.name.toLowerCase() === 'to do',
        )[0]._id,
      );
    const colTasks = props.currentBoard.columns
      .map((col) => col.tasks)
      .flat();
    const cTasks: ITaskForCalendar[] = colTasks.map((t: any) => ({
      title: t.name,
      start: new Date(t.createdAt),
      end: new Date(t.dueDate),
      allDay: true,
      redirectTo: `/company/${props.company.uniqueName}/project/${t.project}/board/${t.boardId}/task/${t._id}`,
      priority: t.priority,
    }));
    setTasksForCalendarView(cTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.currentBoard]);

  return (
    <Container className="h-100 ph3 cf flex flex-column">
      <div className="flex flex-column mb3">
        <div className="flex flex-wrap justify-between">
          <div
            className="flex flex-column"
            style={{
              width: isMobileOnly ? 'auto' : 'calc(100%/3)',
              flexBasis: isMobileOnly ? '100%' : 'auto',
            }}
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
            style={{ width: isMobileOnly ? 'auto' : 'calc(100%/3)' }}
          >
            {props.currentProject.name}
          </ProjectName>
          <div
            className={`flex ${
              isMobileOnly ? 'justify-center' : 'justify-end'
            }`}
            style={{ width: isMobileOnly ? 'auto' : 'calc(100%/3)' }}
          >
            <MemberGroup members={props.currentBoard.members} />
          </div>
        </div>
        <SecondaryHeader className="flex flex-column flex-row-ns items-center">
          <div
            className={`flex items-center ${
              isMobileOnly && 'justify-between'
            }`}
          >
            <TasksNumber>
              <h3>{t('app.project.Tasks.Tasks')}</h3>
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
            <CreateTaskButton columnId={todoColumnId} />
          </div>
          <div className="flex justify-center">
            <ViewSelectDiv
              fetchingBoard={props.fetchingBoard}
              className="flex items-center"
            >
              <p>{t('app.project.Tasks.View')}:</p>
              <p
                onClick={() => {
                  handleViewChange('list');
                }}
                className={`${view === 'list' && 'active'}`}
              >
                <Tooltip title="List" placement="top">
                  <ListIcon />
                </Tooltip>
              </p>
              <p
                onClick={() => {
                  handleViewChange('board');
                }}
                className={`${view === 'board' && 'active'}`}
              >
                <Tooltip title="Board" placement="top">
                  <ViewWeekIcon />
                </Tooltip>
              </p>
              <p
                onClick={() => {
                  handleViewChange('calendar');
                }}
                className={`${view === 'calendar' && 'active'}`}
              >
                <Tooltip title="Calendar" placement="top">
                  <DateRangeIcon />
                </Tooltip>
              </p>
            </ViewSelectDiv>
          </div>
          <div
            className={`flex ${
              isMobileOnly ? 'justify-center' : 'justify-end'
            }`}
          >
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
                      <p
                        className="flex items-center pointer"
                        onClick={() => props.setSortBy('dueDate')}
                        style={{
                          marginRight:
                            props.currentBoard.sortBy === 'dueDate'
                              ? '8px'
                              : '20px',
                        }}
                      >
                        <Icon
                          icon={
                            props.currentBoard.sortBy === 'dueDate'
                              ? 'tick-circle'
                              : 'circle'
                          }
                          iconSize={16}
                          className="mr2"
                          color={
                            props.currentBoard.sortBy === 'dueDate'
                              ? '#2EB67D'
                              : 'inherit'
                          }
                        />
                        {t('app.project.Tasks.Due-Date')}
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
                      <p
                        className="mr2 flex items-center pointer"
                        onClick={() => props.setSortBy('priority')}
                        style={{
                          marginRight:
                            props.currentBoard.sortBy === 'priority'
                              ? '8px'
                              : '20px',
                        }}
                      >
                        <Icon
                          icon={
                            props.currentBoard.sortBy === 'priority'
                              ? 'tick-circle'
                              : 'circle'
                          }
                          iconSize={16}
                          className="mr2"
                          color={
                            props.currentBoard.sortBy === 'priority'
                              ? '#2EB67D'
                              : 'inherit'
                          }
                        />
                        {t('app.project.Tasks.Priority')}
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
                      <p>{t('app.project.Tasks.Sort')}</p>
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
                        <p className="ma0">
                          {t('app.project.Tasks.Assignee')}
                        </p>
                        <span
                          className="bp3-tag pointer bg-light-gray black"
                          onClick={() => setFilterPopoverOpen(false)}
                        >
                          {t('app.project.Tasks.Close')}
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
                      <p>{t('app.project.Tasks.Filter')}</p>
                    </div>
                  }
                />
              </SortingDiv>
            </div>
          </div>
        </SecondaryHeader>
      </div>
      {view === 'board' && <PriorityColorList />}
      {view === 'board' ? (
        <ColumnsContainer />
      ) : view === 'list' ? (
        <TaskList />
      ) : view === 'calendar' ? (
        <CalendarView tasks={tasksForCalendarView} />
      ) : null}
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  company: state.companyReducer.currentCompany,
  currentBoard: state.taskIndexReducer.taskReducer.currentBoard,
  fetchingBoard: state.taskIndexReducer.taskReducer.fetchingBoard,
  currentProject: state.projectReducer.projectDetails,
});

export default connect(mapStateToProps, {
  setSortBy,
  setFilerUsers,
  setPreferredView,
})(BoardDetails);
