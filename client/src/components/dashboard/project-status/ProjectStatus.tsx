// import { DateInput } from '@blueprintjs/datetime';
<<<<<<< HEAD
import { DateInput } from '@blueprintjs/datetime';
import { CircularProgress } from '@material-ui/core';
import { tigrowApi } from 'config';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
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
=======
import React, { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
>>>>>>> automatic deploy
import './ProjectStatus.scss';
import TasksTable from './TasksTable';
import { customStyles } from 'layouts/company/settings/Index';
import ErrorText from 'layouts/company/settings/ErrorText';

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
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(
    false,
  );
  const history = useHistory();

  async function getInfo() {
    setIsLoading(true);
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
      } catch (err) {
        if (err.response.data.status === 403) {
          await props.setSubscriptionExpire();
          await props.getCurrentSubscription();
          props.company.role === 'superAdmin'
            ? window.location.replace(
                `${window.location.origin}/company/${props.company.uniqueName}/settings/`,
              )
            : setIsSubscriptionExpired(true);
        }
      }
    }
    setIsLoading(false);
  }
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
    setTotalTasks(fTasks.length);
    setRemainingTasks(
      fTasks.filter((m) => m.status !== 'done').length,
    );
  }, [fTasks]);

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

  const closeModal = () => {
    props.company.role === 'superAdmin'
      ? history.push(`/company/${props.company.uniqueName}/settings/`)
      : history.push(`/${props.user.name}/home`);
  };

  const { t } = useTranslation();

  return (
    <div className="project-status mb5">
      <div className="mb3 text-center">
        <h3
          className="f3-ns f5"
          style={{
            color: '#34b3e9',
            fontSize: '2.3rem',
            textAlign: 'center',
          }}
        >
          {t('app.project.Tasks.Task-Status')}
        </h3>
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
<<<<<<< HEAD
                Reset
              </button>
            </div>
          )}

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
=======
                {/* <Field<string>
                  name="dueDate"
                  render={({ input, meta }) => (
                    <DateInput
                      formatDate={(date: Date) =>
                        date.toLocaleDateString()
                      }
                      placeholder={t(
                        'app.project.Tasks.Filter-Duedate',
                      )}
                      // placeholder="Filter by Due date"
                      parseDate={(str: string) => new Date(str)}
                      onChange={input.onChange}
                      canClearSelection={false}
                      value={
                        input.value ? new Date(input.value) : null
                      }
                      popoverProps={{
                        targetClassName: 'w-100',
                      }}
                    />
                  )}
                /> */}
              </div>
            </>
>>>>>>> automatic deploy
          )}
        </div>
      )}
      {isSubscriptionExpired && (
        <Modal
          isOpen={isSubscriptionExpired}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <ErrorText
            closeModal={closeModal}
            text={`${
              props.company.role === 'superAdmin'
                ? 'Your Subscription has expired'
                : 'Your Subscription has expired, contact with Super Admin'
            }`}
            subtext="To keep using Onethread without interruption you need to pay your
              dues."
          />
        </Modal>
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
