import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  useAsyncDebounce,
  usePagination,
  useExpanded,
} from 'react-table';
import { isEmpty, isNil } from 'lodash';

import { getAllUserTasks } from 'stores/task/Actions';
import { TasksTableContext } from 'components/task/TasksTableContext';

import { ClickAwayListener } from '@material-ui/core';

import { TaskTableColumns } from 'components/task/TaskTableColumns';
import TasksTable from 'components/task/TasksTable';
import TaskTableSkeleton from 'components/task/TaskTableSkeleton';
import TaskDialog from 'components/home/task-section/TaskDialog';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  HeaderContainer,
  Header,
  SortAndFilter,
  StyledFilterPopover,
  StyledInput,
  // StyledInput,
} from 'components/table/StyledTable.styles';
import { AlignCenter } from 'components/UtilComponents';
import { Dialog, Icon, Popover } from '@blueprintjs/core';
import { Container } from './Index.styles';
import { DateRange } from '@blueprintjs/datetime';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import TasksFilter from 'components/task/TasksFilter';
import { Link } from 'react-router-dom';

interface Props {
  userTasks: any;
}

interface ITaskSectionInternalProps extends Props {
  userId: string;
  fetchingUserTasks: boolean;
  errorOnFetchingUserTasks: string;
  getAllUserTasks: () => void;
}

const TaskSection = (props: ITaskSectionInternalProps) => {
  const [openTaskDialog, setOpenTaskDialog] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [taskList, setTaskList] = useState([]);
  const data = useMemo(() => taskList, [taskList]);
  const columns = useMemo(() => TaskTableColumns, []);
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
  const [selectedStatusList, setSelectedStatusList] = useState<any>(
    [],
  );
  const [selectedProjectList, setSelectedProjectList] = useState<any>(
    [],
  );
  const [selectedDueDateOption, setSelectedDueDateOption] =
    useState<string>('');
  const [selectedDueDateRange, setSelectedDueDateRange] =
    useState<DateRange>([null, null]);
  const [selectedLabelList, setSelectedLabelList] = useState<any>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const { userTasks } = props;

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
        pageSize: 10,
        hiddenColumns: ['createdAt', 'priority'],
        sortBy: [{ id: 'dueDate', desc: true }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
  );

  useEffect(() => {
    if (props.userId) {
      props.getAllUserTasks();
      setLoading(true);
    }
  }, [props.userId]);

  useEffect(() => {
    if (
      loading === true &&
      props.fetchingUserTasks === false &&
      props.errorOnFetchingUserTasks === ''
    ) {
      setTaskList(userTasks);
      setLoading(false);
    }
  }, [
    loading,
    props.fetchingUserTasks,
    props.errorOnFetchingUserTasks,
    userTasks,
  ]);
  const { globalFilter, pageSize, pageIndex } = state;

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

  const handleClearFilter = () => {
    setSelectedStatusList([]);
    setSelectedProjectList([]);
    setSelectedDueDateRange([null, null]);
    setSelectedDueDateOption('');
    setTaskList(userTasks);
    setAllFilters([]);
  };

  useEffect(() => {
    !isNil(userTasks) &&
      !isEmpty(userTasks) &&
      setTaskList(userTasks);
  }, [userTasks]);

  useEffect(() => {
    setFilter('project', selectedProjectList);
  }, [selectedProjectList]);

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
      selectedLabelList,
      selectedProjectList,
      selectedDueDateOption,
      selectedDueDateRange,
      setSelectedStatusList,
      setSelectedLabelList,
      setSelectedProjectList,
      setSelectedDueDateOption,
      setSelectedDueDateRange,
    }),
    [
      globalFilter,
      data,
      selectedDueDateOption,
      selectedDueDateRange,
      selectedProjectList,
      selectedStatusList,
      selectedLabelList,
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
          <SortAndFilter>
            <AlignCenter>
              {(!isEmpty(selectedStatusList) ||
                !isEmpty(selectedProjectList) ||
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
              <AlignCenter
                onClick={() => {
                  setShowInputField(true);
                }}
              >
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
        {taskList.length === 0 ? (
          loading ? (
            <TaskTableSkeleton />
          ) : (
            <div className="flex flex-col mt3">
              <div className="mr2">No task has been created.</div>
              <Link to="#" onClick={() => setOpenTaskDialog(true)}>
                Add new task?
              </Link>
            </div>
          )
        ) : (
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
        )}
        <Dialog
          canOutsideClickClose={true}
          canEscapeKeyClose={true}
          autoFocus
          style={{ borderRadius: '1rem' }}
          className="w-auto h-auto pb0"
          isOpen={openTaskDialog}
          onClose={() => setOpenTaskDialog(false)}
        >
          <TaskDialog setShowDialog={setOpenTaskDialog} />
        </Dialog>
      </Container>
    </TasksTableContext.Provider>
  );
};

const mapStateToProps = (state: any) => ({
  userId: state.userReducer.user._id,
  userTasks: state.taskIndexReducer.taskReducer.userTasks,
  fetchingUserTasks:
    state.taskIndexReducer.taskReducer.fetchingUserTasks,
  errorOnFetchingUserTasks:
    state.taskIndexReducer.taskReducer.errorOnFetchingUserTasks,
});

export default connect(mapStateToProps, { getAllUserTasks })(
  TaskSection,
);
