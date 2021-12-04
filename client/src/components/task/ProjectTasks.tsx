import { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { isEmpty, isNil } from 'lodash';
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  useAsyncDebounce,
  usePagination,
  useExpanded,
  useRowSelect,
} from 'react-table';

import { TasksTableContext } from './TasksTableContext';
import { TaskTableColumns } from './TaskTableColumns';
import { getAllProjectTasks } from 'stores/task/Actions';
import { ITask, ITaskStatus } from 'stores/task/Reducer';
import { IProject } from 'stores/project/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { formatTasksForCalendar, tasksFilterFn } from 'helpers/utils';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { DateRange } from '@blueprintjs/datetime/lib/esm/common/dateRange';
import { Dialog } from '@blueprintjs/core';

import {
  Container,
  HeaderContainer,
  Header,
  SortAndFilter,
  StyledFilterPopover,
  StyledInput,
} from 'components/table/StyledTable.styles';
import { AlignCenter } from 'components/UtilComponents';
import TaskDialog from 'components/home/task-section/TaskDialog';
import TasksFilter from './TasksFilter';
import TaskTableSkeleton from './TaskTableSkeleton';
import TasksTable from './TasksTable';
import CalendarView, {
  ITaskForCalendar,
} from 'components/calendar/CalendarView';
import TaskViewSelect from './TaskViewSelect';
import ColumnsContainer from 'components/column/ColumnsContainer';
import { Link } from 'react-router-dom';
import ExportTasks from 'components/export-tasks/ExportTasks';
import IndeterminateCheckbox from 'components/table/IndeterminateCheckbox';
import TaskTableModals from './TaskTableModals';
import TaskTableActions from './TaskTableActions';

interface IProjectTasksProps {
  projectTaskList: ITask[];
  project: IProject;
  company: ICompany;
  fetchingProjectTasks: boolean;
  singleProjectLoading: boolean;
  errorOnFetchingProjectTasks: string;
  getAllProjectTasks: () => void;
  statusList: ITaskStatus[];
}

const ProjectTasks = (props: IProjectTasksProps) => {
  const {
    projectTaskList,
    project,
    company,
    singleProjectLoading,
    fetchingProjectTasks,
    errorOnFetchingProjectTasks,
  } = props;
  const [openTaskDialog, setOpenTaskDialog] =
    useState<boolean>(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  const [taskList, setTaskList] = useState<ITask[]>([]);
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
  const [selectedStatusList, setSelectedStatusList] = useState<any>(
    [],
  );
  const [selectedLabelList, setSelectedLabelList] = useState<any>([]);
  const [selectedAssigneeList, setSelectedAssigneeList] = useState<any>([]);
  const [selectedDueDateOption, setSelectedDueDateOption] =
    useState<string>('');
  const [selectedDueDateRange, setSelectedDueDateRange] =
    useState<DateRange>([null, null]);
  const [selectedView, setSelectedView] = useState<
    'list' | 'board' | 'calendar'
  >((localStorage.getItem('selectedView') as any) || 'list');
  const [tasksForCalendarView, setTasksForCalendarView] = useState<
    ITaskForCalendar[]
  >([]);
  const [showEditTaskDialog, setShowEditTaskDialog] =
    useState<boolean>(false);
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] =
    useState<boolean>(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const data = useMemo(() => taskList, [taskList]);
  const columns = useMemo(() => TaskTableColumns, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    allColumns,
    state,
    setFilter,
    setAllFilters,
    setGlobalFilter,
    page,
    setPageSize,
    gotoPage,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize:
          window.innerHeight > 1020
            ? 10
            : window.innerHeight > 800
              ? 7
              : 5,
        hiddenColumns: ['createdAt', 'priority'],
        // sortBy: [{ id: 'createdAt', desc: true }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox
                onClick={(e) => e.stopPropagation()}
                {...getToggleAllRowsSelectedProps()}
              />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox
                onClick={(e) => e.stopPropagation()}
                {...row.getToggleRowSelectedProps()}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    },
  );

  const { globalFilter, pageSize, pageIndex } = state;

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

  const handleClearFilter = () => {
    setSelectedStatusList([]);
    setSelectedLabelList([]);
    setSelectedAssigneeList([]);
    setSelectedDueDateRange([null, null]);
    setSelectedDueDateOption('');
    setTaskList(projectTaskList);
    setAllFilters([]);
  };

  useEffect(() => {
    if (project._id) {
      props.getAllProjectTasks();
    }
  }, [project._id]);

  useEffect(() => {
    if (!isNil(projectTaskList) && !isEmpty(projectTaskList)) {
      setTaskList(projectTaskList);
      setTasksForCalendarView(
        formatTasksForCalendar(projectTaskList),
      );
    }
  }, [projectTaskList, project._id, company._id]);

  useEffect(() => {
    if (
      (!isNil(globalFilter) && !isEmpty(globalFilter)) ||
      (!isNil(selectedDueDateOption) &&
        !isEmpty(selectedDueDateOption)) ||
      (!isNil(selectedStatusList) && !isEmpty(selectedStatusList)) ||
      (!isNil(selectedLabelList) && !isEmpty(selectedLabelList)) ||
      (!isNil(selectedAssigneeList) && !isEmpty(selectedAssigneeList))
    ) {
      const tasks = tasksFilterFn(
        projectTaskList,
        globalFilter,
        selectedDueDateOption,
        selectedDueDateRange,
        selectedStatusList,
        selectedLabelList,
        selectedAssigneeList
      );
      setTasksForCalendarView(formatTasksForCalendar(tasks));
    } else {
      setTaskList(projectTaskList);
      setTasksForCalendarView(
        formatTasksForCalendar(projectTaskList),
      );
    }
  },
    [
      globalFilter,
      projectTaskList,
      selectedDueDateOption,
      selectedDueDateRange,
      selectedStatusList,
      selectedLabelList,
      selectedAssigneeList
    ]
  );

  useEffect(() => {
    if (singleProjectLoading === false) {
      if (
        loadingData === true &&
        fetchingProjectTasks === false &&
        errorOnFetchingProjectTasks === ''
      ) {
        setLoadingData(false);
      }
      if (
        loadingData === true &&
        fetchingProjectTasks === false &&
        errorOnFetchingProjectTasks !== ''
      ) {
        setError(
          'There was a problem fetching task list, try reloading the page.',
        );
        setLoadingData(false);
      }
    } else {
      setLoadingData(true);
    }
  }, [
    loadingData,
    singleProjectLoading,
    fetchingProjectTasks,
    errorOnFetchingProjectTasks,
  ]);

  useEffect(() => {
    setFilter('status', selectedStatusList);
  }, [selectedStatusList]);

  useEffect(() => {
    setFilter('labels', selectedLabelList);
  }, [selectedLabelList]);

  useEffect(() => {
    setFilter('members', selectedAssigneeList);
  }, [selectedAssigneeList]);

  useEffect(() => {
    const filterValue = {
      type: selectedDueDateOption,
      range: selectedDueDateRange,
    };
    setFilter('dueDate', filterValue);
  }, [selectedDueDateOption, selectedDueDateRange]);

  const providerValue = useMemo(
    () => ({
      globalFilter,
      tasks: data,
      selectedStatusList,
      selectedLabelList,
      selectedAssigneeList,
      selectedDueDateOption,
      selectedDueDateRange,
      setSelectedStatusList,
      setSelectedLabelList,
      setSelectedAssigneeList,
      setSelectedDueDateOption,
      setSelectedDueDateRange,
    }),
    [
      globalFilter,
      data,
      selectedStatusList,
      selectedLabelList,
      selectedAssigneeList,
      selectedDueDateOption,
      selectedDueDateRange
    ],
  );

  const updateTaskStatusForBoardLocally = (data) => {
    const status = props.statusList.filter(
      (status) => status._id === data.status,
    )[0];
    setTaskList(
      projectTaskList?.map((task: ITask) =>
        task._id === data._id ? { ...task, status: status } : task,
      ),
    );
  };

  return (
    <TasksTableContext.Provider value={providerValue}>
      <Container>
        <HeaderContainer>
          <Header>
            Tasks{' '}
            {taskList.length > 0 && <span>({taskList.length})</span>}
            <ExportTasks
              data={taskList}
              name={`${props.project.name}`}
            />
          </Header>
          <TaskViewSelect
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
          <SortAndFilter>
            <AlignCenter>
              {(!isEmpty(selectedStatusList) ||
                !isEmpty(selectedLabelList) ||
                !isEmpty(selectedAssigneeList) ||
                !isEmpty(selectedDueDateOption)) && (
                  <ClearOutlinedIcon
                    fontSize="small"
                    onClick={handleClearFilter}
                  />
                )}
            </AlignCenter>
            <ClickAwayListener
              onClickAway={() => {
                if (
                  globalFilter === '' ||
                  globalFilter === undefined
                ) {
                  setShowInputField(false);
                }
              }}
            >
              <AlignCenter onClick={() => setShowInputField(true)}>
                {showInputField ? (
                  <StyledInput onChange={handleSearchChange} />
                ) : (
                  <Icon icon="search" />
                )}
                Search
              </AlignCenter>
            </ClickAwayListener>
            <TasksFilter
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            />
            <Popover
              interactionKind="click"
              position="bottom-right"
              content={
                <StyledFilterPopover>
                  <p className="bb">Customize Table</p>

                  {allColumns.map((column) =>
                    !(
                      column.id === 'expander' ||
                      column.id === 'selection'
                    ) ? (
                      <div key={column.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={column.isVisible}
                            disabled={column.id === 'name'}
                            {...column.getToggleHiddenProps()}
                          />{' '}
                          {column.Header}
                        </label>
                      </div>
                    ) : null,
                  )}
                </StyledFilterPopover>
              }
              target={<MoreVertIcon fontSize="small" />}
            />
          </SortAndFilter>
        </HeaderContainer>
        {projectTaskList.length === 0 ? (
          loadingData ? (
            <TaskTableSkeleton />
          ) : error ? (
            <div className="mt3 red">{error}</div>
          ) : (
            <div className="mt3">
              No Tasks{' '}
              <Link to="#" onClick={() => setOpenTaskDialog(true)}>
                Add new tasks?
              </Link>
            </div>
          )
        ) : (
          {
            list: (
              <>
                <TaskTableActions
                  setShowDeleteTaskDialog={setShowDeleteTaskDialog}
                  selectedTask={selectedFlatRows}
                  type="project"
                  setShowEditTaskDialog={setShowEditTaskDialog}
                />
                <TasksTable
                  getTableProps={getTableProps}
                  getTableBodyProps={getTableBodyProps}
                  headerGroups={headerGroups}
                  rows={rows}
                  prepareRow={prepareRow}
                  visibleColumns={visibleColumns}
                  page={page}
                  pageIndex={pageIndex}
                  gotoPage={gotoPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setOpenTaskDialog={setOpenTaskDialog}
                />
              </>
            ),
            board: (
              <ColumnsContainer
                updateTaskStatusForBoardLocally={
                  updateTaskStatusForBoardLocally
                }
              />
            ),
            calendar: <CalendarView tasks={tasksForCalendarView} />,
          }[selectedView]
        )}
        <Dialog
          canOutsideClickClose={true}
          canEscapeKeyClose={true}
          autoFocus
          style={{ borderRadius: '1rem' }}
          className="w-auto h-auto pb0"
          onClose={() => setOpenTaskDialog(false)}
          isOpen={openTaskDialog}
        >
          <TaskDialog setShowDialog={setOpenTaskDialog}></TaskDialog>
        </Dialog>
      </Container>
      <TaskTableModals
        setShowDeleteTaskDialog={setShowDeleteTaskDialog}
        setShowEditTaskDialog={setShowEditTaskDialog}
        showDeleteTaskDialog={showDeleteTaskDialog}
        showEditTaskDialog={showEditTaskDialog}
        taskList={selectedFlatRows}
        type="project"
      />
    </TasksTableContext.Provider>
  );
};

const mapStateToProps = (state: any) => ({
  projectTaskList: state.taskIndexReducer.taskReducer.projectTaskList,
  project: state.projectReducer.projectDetails,
  fetchingProjectTasks:
    state.taskIndexReducer.taskReducer.fetchingProjectTasks,
  singleProjectLoading: state.projectReducer.singleProjectLoading,
  errorOnFetchingProjectTasks:
    state.taskIndexReducer.taskReducer.errorOnFetchingProjectTasks,
  company: state.companyReducer.currentCompany,
  statusList: state.projectReducer.projectDetails.taskStatus,
});

export default connect(mapStateToProps, {
  getAllProjectTasks,
})(ProjectTasks);
