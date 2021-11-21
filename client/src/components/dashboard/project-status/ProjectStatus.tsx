import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tigrowApi } from 'config';
import { connect } from 'react-redux';
// import { isMobileOnly } from 'react-device-detect';

import { DateInput } from '@blueprintjs/datetime/lib/esm/dateInput';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import ListIcon from '@material-ui/icons/List';
import ShareIcon from '@material-ui/icons/Share';
import DateRangeIcon from '@material-ui/icons/DateRange';

import {
  getCompanyAnnouncement,
  getLatestCompletedTasks,
} from 'stores/company/Actions';
import {
  getCurrentSubscription,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
} from 'stores/subscriptionBilling/Actions';
import { priorityColor, tokenConfig } from 'stores/UtilsActions';

import TasksTable from './TasksTable';
import MultiSelectComponent from './MultiSelectComponent';
import CalendarView from 'components/calendar/CalendarView';

import { ViewSelectDiv } from 'layouts/company/boardDetails/BoardDetails.styles';
import { ExportDiv } from './ProjectStatus.styles';
import './ProjectStatus.scss';

interface Data {
  taskname: string;
  projectname: string;
  priority: number;
  members: string;
  dueDate: string;
  status: string;
  subtask: number;
  randomField: string;
}

type Order = 'asc' | 'desc';

const getModifiedTasks = (a) => {
  return a.map((task) => ({
    taskname: task.name,
    projectname: task.project.name,
    members: task.members,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate : `December 31, 1970`,
    doneSubtasks: task.doneSubtasks,
    totalSubtasks: task.totalSubtasks,
    boardId: task.boardId,
    companyUniqueName: task.company.uniqueName,
    projectId: task.project._id,
    taskId: task._id,
    priority: task.priority,
    remainingSubtask: task.totalSubtasks - task.doneSubtasks,
  }));
};

const getUniqueList = (a, fld) =>
  [...Array.from(new Set(a.map((m) => m[fld])))].map((a) => ({
    id: a,
    label: a,
  }));

const filterSpacing = {
  paddingRight: 10,
  paddingBottom: 5,
  width: '100%',
};

const ProjectStatusComponent = (props) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  // API Data
  const [allTasks, setTasks] = useState<any[]>([]);
  const [fTasks, setfTasks] = useState<any[]>([]);
  const [runnningProject, setRunnningProject] = useState(0);
  const [completedProject, setCompletedProject] = useState(0);

  // Material UI Table State
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('priority');
  const [selected, setSelected] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter State
  const [selectedStatus, setSelectedStatus] = useState<any[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<any[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<any[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<any[]>([]);

  // Unique data
  const [uniqueProject, setUniqueProject] = useState<any[]>([]);
  const [uniqueStatus, setUniqueStatus] = useState<any[]>([]);
  const [uniquePriority, setUniquePriority] = useState<any[]>([]);
  const [uniqueMembers, setUniqueMembers] = useState<any[]>([]);

  // Task
  const [totalTasks, setTotalTasks] = useState(0);
  const [remainingTasks, setRemainingTasks] = useState(0);

  // Date time
  const [date, setDate] = useState<any>(null);

  // Calendar View Task + View
  const [view, setView] = useState<any>('table');
  const [calTask, setCalTask] = useState<any[]>([]);

  async function getInfo() {
    setIsLoading(true);
    const headers = tokenConfig();

    if (props.company._id) {
      const response = await tigrowApi.get(
        `company/${props.company._id}/dashboard`,
        headers,
      );
      const { data } = response.data;
      const mTask = getModifiedTasks(data.taskCompilation);

      setTasks(mTask);
      setfTasks(mTask);

      setCalTask(
        data.taskCompilation.map((t) => ({
          title: t.name,
          start: new Date(t.createdAt),
          end: new Date(t.dueDate),
          allDay: true,
          redirectTo: `/company/${t.company._id}/project/${t.project._id}/board/${t.boardId}/task/${t._id}`,
          priority: t.priority,
        })),
      );
      // setCalTask(mTask.map(t => ))
      setTotalTasks(data.totalTasks);
      setRunnningProject(data.runningProjects);
      setCompletedProject(data.completedProjects);
      // unique project
      setUniqueProject(getUniqueList(mTask, 'projectname'));
      // unique status
      setUniqueStatus(getUniqueList(mTask, 'status'));
      // unique priority
      let uniquePriorityT: any = getUniqueList(mTask, 'priority');
      uniquePriorityT = uniquePriorityT.map((p) => {
        const f = priorityColor.find((pc) => pc.code === p.label);
        if (!f) return null;
        return {
          id: f.name,
          label: f.name,
        };
      });
      setUniquePriority(uniquePriorityT);
      // Unique members
      let uniqueMembersT: any[] = [];
      const uniqueMembersMap = {};

      for (let task of mTask) {
        if (task.members) {
          const members = task.members.map(
            (t) => `${t.firstName} ${t.lastName}`,
          );
          for (let member of members) {
            if (uniqueMembersMap[member]) continue;
            uniqueMembersMap[member] = true;
            uniqueMembersT.push(member);
          }
        }
      }
      uniqueMembersT = uniqueMembersT.map((m) => ({
        id: m,
        label: m,
      }));
      setUniqueMembers(uniqueMembersT);
    }

    setIsLoading(false);
  }

  const resetHandler = () => {
    setSelectedStatus([]);
    setSelectedPriority([]);
    setSelectedProjects([]);
    setSelectedAssignee([]);
    setDate(null);
  };
  const didYouFilter = !(
    selectedStatus.length === 0 &&
    selectedAssignee.length === 0 &&
    selectedPriority.length === 0 &&
    selectedProjects.length === 0
  );

  const handleViewChange = (v: 'table' | 'calendar') => {
    setView(v);
  };

  useEffect(() => {
    getInfo();
  }, [props.company._id]);

  useEffect(() => {
    if (
      selectedStatus.length === 0 &&
      selectedAssignee.length === 0 &&
      selectedPriority.length === 0 &&
      selectedProjects.length === 0 &&
      !date
    ) {
      setfTasks(allTasks);
      return;
    }
    const colorMapper = {};
    for (let pc of priorityColor) colorMapper[pc.name] = pc.code;

    const fTaskList: any[] = [];
    for (let task of allTasks) {
      let found = false;
      let takeThis = true;
      // member
      if (selectedAssignee.length > 0) {
        for (let member of task.members) {
          const memberName = `${member.firstName} ${member.lastName}`;
          let res = selectedAssignee.find(
            (s) => s.label === memberName,
          );
          if (res) {
            found = true;
            break;
          }
        }
        if (!found) takeThis = false;
      }
      // projectName
      if (selectedProjects.length > 0) {
        found = selectedProjects.find(
          (p) => p.label === task.projectname,
        );
        if (!found) takeThis = false;
      }
      // priority
      if (selectedPriority.length > 0) {
        found = selectedPriority.find(
          (p) =>
            colorMapper[p.label].toString() ===
            task.priority.toString(),
        );
        if (!found) takeThis = false;
      }

      // status
      if (selectedStatus.length > 0) {
        found = selectedStatus.find(
          (p) =>
            p.label.split(' ').join('-').toLowerCase() ===
            task.status,
        );
        if (!found) takeThis = false;
      }
      const formattedDate = (p) => new Date(p).toLocaleDateString();
      // Date
      if (date) {
        found = false;
        if (task.dueDate !== 'December 31, 1970') {
          found = formattedDate(task.dueDate) === formattedDate(date);
        }
        if (!found) takeThis = false;
      }

      if (takeThis) fTaskList.push(task);
    }

    setfTasks(fTaskList);
  }, [
    selectedStatus,
    selectedPriority,
    selectedProjects,
    selectedAssignee,
    date,
  ]);

  useEffect(() => {
    setRemainingTasks(fTasks.length);
  }, [fTasks]);

  return (
    <div className="project-status mb5">
      <div className="text-center">
        <h3
          className="f3-ns f5"
          style={{
            color: '#08A0F7',
            fontSize: '2.3rem',
            textAlign: 'center',
          }}
        >
          {t('app.project.Tasks.Task-Status')}
        </h3>
      </div>
      <div className={`flex items-center justify-between mb2 w-100`}>
        <div className={`w-third`}></div>
        <ViewSelectDiv
          fetchingBoard={props.fetchingBoard}
          className="flex items-center tc w-third"
        >
          <p>{t('app.project.Tasks.View')}:</p>
          <p
            onClick={() => {
              handleViewChange('table');
            }}
            className={`${view === 'table' && 'active'}`}
          >
            <Tooltip title="List" placement="top">
              <ListIcon />
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
        <div className={`w-third flex justify-end`}>
          {isLoading === false && (
            <Tooltip title="Export Tasks" placement="top">
              <ExportDiv
                className={`${isLoading ? '' : 'pointer'}`}
                onClick={() => {
                  // setOpenExportDialog(true);
                  // setLoadingExportTasks(true);
                }}
              >
                <ShareIcon />
                Export Tasks
              </ExportDiv>
            </Tooltip>
          )}
        </div>
      </div>
      {isLoading ? (
        <div
          className="flex justify-center mt2 w-100"
          style={{ paddingTop: 25, paddingBottom: 30 }}
        >
          <CircularProgress
            style={{ color: 'rgb(48, 48, 83)' }}
            size={30}
          />
        </div>
      ) : (
        <div>
          <div className="status-bar">
            <div className="status-count">
              <p style={{ paddingRight: 20 }}>
                {t('app.project.Tasks.Total-tasks')}: {totalTasks}
              </p>
              <p>
                {t('app.project.Tasks.Remaining-tasks')}:{' '}
                {remainingTasks}
              </p>
            </div>
            <div className="status-count">
              <p style={{ paddingRight: 20 }}>
                {t('app.project.Tasks.Running-projects')}:{' '}
                {runnningProject}
              </p>
              <p>
                {t('app.project.Tasks.Completed-projects')}:{' '}
                {completedProject}
              </p>
            </div>
          </div>
          <div className="task-filters">
            <div style={filterSpacing}>
              <MultiSelectComponent
                container={uniqueStatus}
                placeholder={t('app.project.Tasks.Filter-status')}
                selected={selectedStatus}
                setSelected={setSelectedStatus}
              />
            </div>
            <div style={filterSpacing}>
              <MultiSelectComponent
                container={uniquePriority}
                placeholder={t('app.project.Tasks.Filter-priority')}
                selected={selectedPriority}
                setSelected={setSelectedPriority}
              />
            </div>
            <div style={filterSpacing}>
              <MultiSelectComponent
                container={uniqueProject}
                placeholder={t('app.project.Tasks.Filter-projects')}
                selected={selectedProjects}
                setSelected={setSelectedProjects}
              />
            </div>
            <div style={filterSpacing}>
              <MultiSelectComponent
                container={uniqueMembers}
                placeholder={t('app.project.Tasks.Filter-assignee')}
                selected={selectedAssignee}
                setSelected={setSelectedAssignee}
              />
            </div>
            <div style={{ ...filterSpacing, paddingRight: 0 }}>
              <DateInput
                formatDate={(date: Date) => date.toLocaleDateString()}
                placeholder={t('app.project.Tasks.Filter-Duedate')}
                parseDate={(str: string) => new Date(str)}
                onChange={(selectedDate) => setDate(selectedDate)}
                canClearSelection={false}
                value={date}
                popoverProps={{
                  targetClassName: 'w-100',
                }}
                defaultValue={new Date(Date.now())}
              />
            </div>
          </div>
          {didYouFilter && (
            <div style={{ textAlign: 'right' }}>
              <button
                className="w4 grow h2 pointer"
                style={{
                  background: 'rgb(52, 132, 240)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 3,
                }}
                onClick={resetHandler}
              >
                Reset
              </button>
            </div>
          )}

          {fTasks.length > 0 && (
            <div className="projects-list w-100">
              {view === 'calendar' && (
                <CalendarView tasks={calTask} />
              )}

              {view === 'table' && (
                <TasksTable
                  order={order}
                  setOrder={setOrder}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                  selected={selected}
                  setSelected={setSelected}
                  page={page}
                  setPage={setPage}
                  rowsPerPage={rowsPerPage}
                  setRowsPerPage={setRowsPerPage}
                  tasks={fTasks}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
    completedTasks: state.companyReducer.completedTasks,
  };
};

export const ProjectStatus = connect(mapStateToProps, {
  getCompanyAnnouncement,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
  getLatestCompletedTasks,
  getCurrentSubscription,
})(ProjectStatusComponent);
