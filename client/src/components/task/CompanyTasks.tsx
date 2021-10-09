import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  useAsyncDebounce,
  usePagination,
} from 'react-table';

import { getAllCompanyTasks } from 'stores/task/Actions';
import { ITask } from 'stores/task/Reducer';
import { TaskTableColumns } from './TaskTableColumns';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import TaskTableSkeleton from './TaskTableSkeleton';
import { AlignCenter } from 'components/UtilComponents';
import TasksTable from './TasksTable';
import {
  Container,
  HeaderContainer,
  Header,
  SortAndFilter,
  StyledFilterPopover,
  StyledInput,
} from 'components/table/StyledTable.styles';

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
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string>('');
  const [showInputField, setShowInputField] =
    useState<boolean>(false);
  const data = useMemo(() => companyTaskList, [companyTaskList]);
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
    setGlobalFilter,
    page,
    pageOptions,
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
        sortBy: [{ id: 'createdAt', desc: true }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const handleSearchChange = useAsyncDebounce((e) => {
    setGlobalFilter(e.target.value || undefined);
  }, 500);

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

  const { globalFilter, pageSize } = state;

  return (
    <Container>
      <HeaderContainer>
        <Header>
          Tasks{' '}
          {companyTaskList.length > 0 && (
            <span>({companyTaskList.length})</span>
          )}
        </Header>
        <SortAndFilter>
          <ClickAwayListener
            onClickAway={() => {
              if (globalFilter === '' || globalFilter === undefined) {
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
          <Popover
            interactionKind="click"
            position="bottom-right"
            content={
              <StyledFilterPopover>
                <p className="bb">Customize Table</p>

                {allColumns.map((column) => (
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
                ))}
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
          pageOptions={pageOptions}
          gotoPage={gotoPage}
          pageSize={pageSize}
        />
      )}
    </Container>
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
