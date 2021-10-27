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
} from 'react-table';

import { TasksTableContext } from './TasksTableContext';
import { TaskTableColumns } from './TaskTableColumns';
import { getAllProjectTasks } from 'stores/task/Actions';
import { ITask } from 'stores/task/Reducer';
import { IProject } from 'stores/project/Reducer';
import { ICompany } from 'stores/company/Reducer';

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

interface IProjectTasksProps {
  projectTaskList: ITask[];
  project: IProject;
  company: ICompany;
  fetchingProjectTasks: boolean;
  singleProjectLoading: boolean;
  errorOnFetchingProjectTasks: string;
  getAllProjectTasks: () => void;
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
  const [filterOpen, setFilterOpen] = useState(false);
  const data = useMemo(() => taskList, [taskList]);
  const columns = useMemo(() => TaskTableColumns, []);

  const [showToaster, setShowToaster] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
  );

  const useToaster = () => {
    return {
      showToaster,
      setShowToaster,
      successMessage,
      setSuccessMessage,
      setErrorMessage,
      errorMessage,
    };
  };

  const { globalFilter, pageSize, pageIndex } = state;

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

  const handleClearFilter = () => {
    setSelectedStatusList([]);
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
      const cTasks: ITaskForCalendar[] = projectTaskList.map(
        (t: any) => ({
          title: t.name,
          start: new Date(t.createdAt),
          end: new Date(t.dueDate),
          allDay: true,
          redirectTo: `/company/${t.company.uniqueName}/project/${t.project._id}/task/${t._id}`,
          priority: t.priority,
        }),
      );
      setTasksForCalendarView(cTasks);
    }
  }, [projectTaskList, project._id, company._id]);

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
      selectedDueDateOption,
      selectedDueDateRange,
      setSelectedStatusList,
      setSelectedDueDateOption,
      setSelectedDueDateRange,
    }),
    [
      data,
      globalFilter,
      selectedDueDateOption,
      selectedDueDateRange,
      selectedStatusList,
    ],
  );

  return (
    <TasksTableContext.Provider value={providerValue}>
      <Container>
        <HeaderContainer>
          <Header>
            Tasks{' '}
            {taskList.length > 0 && <span>({taskList.length})</span>}
          </Header>
          <TaskViewSelect
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
          <SortAndFilter>
            <AlignCenter>
              {(!isEmpty(selectedStatusList) ||
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

                  {allColumns.map(
                    (column) =>
                      column.id !== 'expander' && (
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
                      ),
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
            <div>{error}</div>
          ) : (
            <div>No Tasks</div>
          )
        ) : (
          {
            list: (
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
            ),
            board: <ColumnsContainer taskList={taskList} />,
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
          <TaskDialog
            setShowDialog={setOpenTaskDialog}
            useToaster={useToaster}
          ></TaskDialog>
        </Dialog>
      </Container>
    </TasksTableContext.Provider>
  );
};

const mapStateToProps = (state: any) => ({
  projectTaskList: state.taskIndexReducer.taskReducer.projectTaskList,
  project: state.projectReducer.projectDetails,
  fetchingProjectTasks: state.projectReducer.fetchingProjectTasks,
  singleProjectLoading: state.projectReducer.singleProjectLoading,
  errorOnFetchingProjectTasks:
    state.projectReducer.errorOnFetchingProjectTasks,
  company: state.companyReducer.currentCompany,
});

export default connect(mapStateToProps, {
  getAllProjectTasks,
})(ProjectTasks);
