import { useEffect, useMemo, useState } from 'react';
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

import { CompanyTasksContext } from './CompanyTasksContext';
import { getAllCompanyTasks } from 'stores/task/Actions';
import { ITask } from 'stores/task/Reducer';
import { TaskTableColumns } from './TaskTableColumns';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import { DateRange } from '@blueprintjs/datetime/lib/esm/common/dateRange';

import TaskTableSkeleton from './TaskTableSkeleton';
import { AlignCenter } from 'components/UtilComponents';
import TasksTable from './TasksTable';
import TasksFilter from './TasksFilter';
import {
  Container,
  HeaderContainer,
  Header,
  SortAndFilter,
  StyledFilterPopover,
  StyledInput,
} from 'components/table/StyledTable.styles';
import { Dialog } from '@blueprintjs/core';
import TaskDialog from 'components/home/task-section/TaskDialog';

interface ICompanyTasks {
  companyTaskList: ITask[];
  fetchingCompanyTasks: boolean;
  errorOnFetchingCompanyTasks: string;
  uniqueCompanyName: string;
  gettingCompanyDetails: boolean;
  getAllCompanyTasks: () => void;
}

const CompanyTasks = (props: ICompanyTasks) => {
  const {
    companyTaskList,
    fetchingCompanyTasks,
    errorOnFetchingCompanyTasks,
    uniqueCompanyName,
    gettingCompanyDetails,
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
  const [selectedProjectList, setSelectedProjectList] = useState<any>(
    [],
  );
  const [selectedDueDateOption, setSelectedDueDateOption] =
    useState<string>('');
  const [selectedDueDateRange, setSelectedDueDateRange] =
    useState<DateRange>([null, null]);
  const [filterOpen, setFilterOpen] = useState(false);
  const data = useMemo(() => taskList, [taskList]);
  const columns = useMemo(() => TaskTableColumns, []);
  const providerValue = useMemo(
    () => ({
      tasks: data,
      selectedStatusList,
      selectedProjectList,
      selectedDueDateOption,
      selectedDueDateRange,
      setSelectedStatusList,
      setSelectedProjectList,
      setSelectedDueDateOption,
      setSelectedDueDateRange,
    }),
    [
      data,
      selectedDueDateOption,
      selectedDueDateRange,
      selectedProjectList,
      selectedStatusList,
    ],
  );

  const [showToaster, setShowToaster] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

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

  const { globalFilter, pageSize, pageIndex } = state;

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

  const handleClearFilter = () => {
    setSelectedStatusList([]);
    setSelectedProjectList([]);
    setSelectedDueDateRange([null, null]);
    setSelectedDueDateOption('');
    setTaskList(companyTaskList);
    setAllFilters([]);
  };

  useEffect(() => {
    if (uniqueCompanyName) {
      props.getAllCompanyTasks();
    }
  }, [uniqueCompanyName]);

  useEffect(() => {
    if (gettingCompanyDetails === false) {
      if (
        loadingData === true &&
        fetchingCompanyTasks === false &&
        errorOnFetchingCompanyTasks === ''
      ) {
        setLoadingData(false);
      }
      if (
        loadingData === true &&
        fetchingCompanyTasks === false &&
        errorOnFetchingCompanyTasks !== ''
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
    gettingCompanyDetails,
    fetchingCompanyTasks,
    errorOnFetchingCompanyTasks,
  ]);

  useEffect(() => {
    !isNil(companyTaskList) &&
      !isEmpty(companyTaskList) &&
      setTaskList(companyTaskList);
  }, [companyTaskList]);

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
    <CompanyTasksContext.Provider value={providerValue}>
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
        {companyTaskList.length === 0 ? (
          loadingData ? (
            <TaskTableSkeleton />
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div>No Tasks</div>
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
          onClose={() => setOpenTaskDialog(false)}
          isOpen={openTaskDialog}
        >
          <TaskDialog
            setShowDialog={setOpenTaskDialog}
            useToaster={useToaster}
          ></TaskDialog>
        </Dialog>
      </Container>
    </CompanyTasksContext.Provider>
  );
};

const mapStateToProps = (state: any) => ({
  companyTaskList: state.taskIndexReducer.taskReducer.companyTaskList,
  fetchingCompanyTasks:
    state.taskIndexReducer.taskReducer.fetchingCompanyTasks,
  errorOnFetchingCompanyTasks:
    state.taskIndexReducer.taskReducer.errorOnFetchingCompanyTasks,
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
  gettingCompanyDetails: state.companyReducer.gettingCompanyDetails,
});

export default connect(mapStateToProps, {
  getAllCompanyTasks,
})(CompanyTasks);
