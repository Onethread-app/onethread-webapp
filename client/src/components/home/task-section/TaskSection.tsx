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

import { getAllUserTasks } from 'stores/task/Actions';

import { Container, Header } from './TaskSection.styles';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import TaskDialog from './TaskDialog';
import { TaskTableColumns } from 'components/task/TaskTableColumns';
import TasksTable from 'components/task/TasksTable';
import TaskTableSkeleton from 'components/task/TaskTableSkeleton';
import {
  CreatableItem,
  HeaderContainer,
  SortAndFilter,
  StyledFilterPopover,
  StyledInput,
} from 'components/table/StyledTable.styles';
import { Dialog, Icon, Popover } from '@blueprintjs/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { AlignCenter } from 'components/UtilComponents';
import { isEmpty, isNil } from 'lodash';
import { ClickAwayListener } from '@material-ui/core';
import TasksFilter from 'components/task/TasksFilter';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { DateRange } from '@blueprintjs/datetime';
import ExportTasks from 'components/export-tasks/ExportTasks';

interface Props {
  userTasks: any;
}

interface ITaskSectionInternalProps extends Props {
  userId: string;
  userName: string;
  fetchingUserTasks: boolean;
  errorOnFetchingUserTasks: string;
  getAllUserTasks: () => void;
}

const TaskSection = (props: ITaskSectionInternalProps) => {
  const { userTasks } = props;
  const [openTaskDialog, setOpenTaskDialog] =
    useState<boolean>(false);
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [taskList, setTaskList] = useState([]);
  const [expand, setExpand] = useState<boolean>(true);
  const [filterOpen, setFilterOpen] = useState(false);
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
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 5,
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

  const handleClearFilter = () => {
    setSelectedStatusList([]);
    setSelectedProjectList([]);
    setSelectedDueDateRange([null, null]);
    setSelectedDueDateOption('');
    setTaskList(userTasks);
    setAllFilters([]);
  };

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

  const { globalFilter, pageSize, pageIndex } = state;

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

  return (
    <Container>
      <HeaderContainer>
        <Header>
          <span className="flex items-center">
            {expand ? (
              <ArrowDropDownIcon
                className="mr2 pointer"
                onClick={() => setExpand(false)}
              />
            ) : (
              <ArrowRightIcon
                className="mr2 pointer"
                onClick={() => setExpand(true)}
              />
            )}
            Tasks due soon
            <ExportTasks data={taskList} name={`${props.userName}`} />
          </span>
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
              if (globalFilter === '' || globalFilter === undefined) {
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
      {expand ? (
        <>
          {taskList.length === 0 ? (
            loading ? (
              <TaskTableSkeleton />
            ) : (
              <div className="flex flex-column">
                <span className="mb2 mt2">
                  No task has been created.{' '}
                </span>
                <CreatableItem
                  onClick={() => setOpenTaskDialog(true)}
                >
                  <span>+ </span> Add new tasks
                </CreatableItem>
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
        </>
      ) : null}
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
  );
};

const mapStateToProps = (state: any) => ({
  userId: state.userReducer.user._id,
  userName: state.userReducer.user.name,
  userTasks: state.taskIndexReducer.taskReducer.userTasks,
  fetchingUserTasks:
    state.taskIndexReducer.taskReducer.fetchingUserTasks,
  errorOnFetchingUserTasks:
    state.taskIndexReducer.taskReducer.errorOnFetchingUserTasks,
});

export default connect(mapStateToProps, { getAllUserTasks })(
  TaskSection,
);
