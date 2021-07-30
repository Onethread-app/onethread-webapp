// import { DateInput } from '@blueprintjs/datetime';
import { CircularProgress } from '@material-ui/core';
import { tigrowApi } from 'config';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  getCompanyAnnouncement,
  getLatestCompletedTasks,
} from 'stores/company/Actions';
// import TasksTable from './TasksTable';
// import MultiSelectComponent from './MultiSelectComponent';
// import { priorityColor } from 'stores/UtilsActions';
// import { useTranslation } from 'react-i18next';
// import { tigrowApi } from 'config';
import {
  getCurrentSubscription,
  setSubscriptionExpire,
  setSubscriptionNotExpire,
} from 'stores/subscriptionBilling/Actions';
import { priorityColor, tokenConfig } from 'stores/UtilsActions';
import MultiSelectComponent from './MultiSelectComponent';
// import { Field, Form } from 'react-final-form';
import './ProjectStatus.scss';
import TasksTable from './TasksTable';

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
  // API Data
  const [allTasks, setTasks] = useState<any[]>([]);
  const [fTasks, setfTasks] = useState<any[]>([]);
  const [runnningProject, setRunnningProject] = useState(0);
  const [completedProject, setCompletedProject] = useState(0);

  // Material UI Table State
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('randomField');
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
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    async function getInfo() {
      const headers = tokenConfig();

      if (props.company._id) {
        try {
          const response = await tigrowApi.get(
            `company/${props.company._id}/dashboard`,
            headers,
          );
          const { data } = response.data;
          const mTask = getModifiedTasks(data.taskCompilation);
          setTasks(mTask);
          setfTasks(mTask);
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

          // Completed Tasks
          setCompletedTasks(
            mTask.filter((m) => m.status === 'done').length,
          );
        } catch (err) {}
      }
    }
    getInfo();
  }, []);

  useEffect(() => {
    if (
      selectedStatus.length === 0 &&
      selectedAssignee.length === 0 &&
      selectedPriority.length === 0 &&
      selectedProjects.length === 0
    ) {
      setfTasks(allTasks);
      return;
    }
    const colorMapper = {};
    for (let pc of priorityColor) colorMapper[pc.name] = pc.code;

    const fTaskList: any[] = [];
    for (let task of allTasks) {
      let found = false;
      // member
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
      if (found) {
        fTaskList.push(task);
        continue;
      }

      // projectName
      found = selectedProjects.find(
        (p) => p.label === task.projectname,
      );
      if (found) {
        fTaskList.push(task);
        continue;
      }

      // priority
      found = selectedPriority.find(
        (p) =>
          colorMapper[p.label].toString() ===
          task.priority.toString(),
      );
      if (found) {
        fTaskList.push(task);
        continue;
      }

      // status
      found = selectedStatus.find(
        (p) =>
          p.label.split(' ').join('-').toLowerCase() === task.status,
      );
      if (found) {
        fTaskList.push(task);
        continue;
      }
    }

    setfTasks(fTaskList);
  }, [
    selectedStatus,
    selectedPriority,
    selectedProjects,
    selectedAssignee,
  ]);

  const { t } = useTranslation();

  return (
    <div className="project-status mb5">
      <div className="mb3 text-center">
        <h3
          className="f3-ns f5"
          style={{
            color: '#3484F0',
            fontSize: '2.3rem',
            textAlign: 'center',
          }}
        >
          {t('app.project.Tasks.Task-Status')}
        </h3>
      </div>
      {fTasks.length === 0 ? (
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
                {t('app.project.Tasks.Total-tasks')}:{' '}
                {allTasks.length}
              </p>
              <p>
                {t('app.project.Tasks.Remaining-tasks')}:{' '}
                {allTasks.length - completedTasks}
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
          </div>
          {fTasks.length > 0 && (
            <div className="projects-list w-100">
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
