import { useEffect, useMemo, useState } from 'react';
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

import { Header, Row } from './TaskSection.styles';

import Hamburger from '../../../resources/images/hamburger.png';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TaskDialog from './TaskDialog';
import { TaskTableColumns } from 'components/task/TaskTableColumns';
import TasksTable from 'components/task/TasksTable';
import TaskTableSkeleton from 'components/task/TaskTableSkeleton';
import { CreatableItem } from 'components/table/StyledTable.styles';
import { Dialog } from '@blueprintjs/core';

interface Props {
  userTasks: any;
  useToaster: () => {
    showToaster: boolean;
    successMessage: string;
    errorMessage: string;
    setShowToaster: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  };
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
  const [expand, setExpand] = useState<boolean>(true);
  const data = useMemo(() => tasks, [tasks]);
  const columns = useMemo(() => TaskTableColumns, []);

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
      <Header>
        <span className="flex items-center">
          Tasks due soon{' '}
          {expand ? (
            <ExpandLessIcon
              className="ml3 pointer"
              onClick={() => setExpand(false)}
            />
          ) : (
            <ExpandMoreIcon
              className="ml3 pointer"
              onClick={() => setExpand(true)}
            />
          )}
        </span>
        <img src={Hamburger} alt="" />
      </Header>
      {expand ? (
        <>
          {tasks.length === 0 ? (
            loading ? (
              <TaskTableSkeleton />
            ) : (
              <Row>
                No task has been created.{' '}
                <CreatableItem
                  onClick={() => setOpenTaskDialog(true)}
                >
                  <span>+ </span> Add new tasks
                </CreatableItem>
              </Row>
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
        <TaskDialog
          setShowDialog={setOpenTaskDialog}
          useToaster={props.useToaster}
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
