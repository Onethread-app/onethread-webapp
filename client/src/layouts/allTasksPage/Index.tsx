import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  // useAsyncDebounce,
  usePagination,
  useExpanded,
} from 'react-table';

import { getAllUserTasks } from 'stores/task/Actions';

import { Dialog } from '@material-ui/core';

import { TaskTableColumns } from 'components/task/TaskTableColumns';
import TasksTable from 'components/task/TasksTable';
import TaskTableSkeleton from 'components/task/TaskTableSkeleton';
import TaskDialog from 'components/home/task-section/TaskDialog';

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
  const [tasks, setTasks] = useState([]);
  const data = useMemo(() => tasks, [tasks]);
  const columns = useMemo(() => TaskTableColumns, []);

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
    // allColumns,
    state,
    // setFilter,
    // setAllFilters,
    // setGlobalFilter,
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

  const {
    // globalFilter,
    pageSize,
    pageIndex,
  } = state;

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
      setTasks(props.userTasks);
      setLoading(false);
    }
  }, [
    loading,
    props.fetchingUserTasks,
    props.errorOnFetchingUserTasks,
    props.userTasks,
  ]);

  return (
    <div>
      {tasks.length === 0 ? (
        loading ? (
          <TaskTableSkeleton />
        ) : (
          <div className="flex flex-row">
            No task has been created.{' '}
            <Link to="#" onClick={() => setOpenTaskDialog(true)}>
              Create Task
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
        />
      )}
      <Dialog open={openTaskDialog} maxWidth={'lg'}>
        <TaskDialog
          setShowDialog={setOpenTaskDialog}
          useToaster={useToaster}
        />
      </Dialog>
    </div>
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
