import { DateInput } from '@blueprintjs/datetime';
import React, { useEffect, useState } from 'react';
import { Field, Form } from 'react-final-form';
import './ProjectStatus.scss';
import TasksTable from './TasksTable';
import MultiSelectComponent from './MultiSelectComponent';
import { priorityColor } from 'stores/UtilsActions';

interface IProjectStatus {
  tasks: any;
  dashboard: any;
}
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

const ProjectStatus = (props: IProjectStatus) => {
  const dashboard = props.dashboard;

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

  // Filtered Tasks
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

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

  const mTask = getModifiedTasks(props.tasks);

  const getUniqueList = (a, fld) =>
    [...Array.from(new Set(a.map((m) => m[fld])))].map((a) => ({
      id: a,
      label: a,
    }));

  const uniqueProject = getUniqueList(mTask, 'projectname');
  const uniqueStatus = getUniqueList(mTask, 'status');
  let uniquePriority: any = getUniqueList(mTask, 'priority');
  uniquePriority = uniquePriority.map((p) => {
    const f = priorityColor.find((pc) => pc.code === p.label);
    if (!f) return null;
    return {
      id: f.name,
      label: f.name,
    };
  });

  let uniqueMembers: any[] = [];
  const uniqueMembersMap = {};

  for (let task of mTask) {
    if (task.members) {
      const members = task.members.map(
        (t) => `${t.firstName} ${t.lastName}`,
      );
      for (let member of members) {
        if (uniqueMembersMap[member]) continue;
        uniqueMembersMap[member] = true;
        uniqueMembers.push(member);
      }
    }
  }
  uniqueMembers = uniqueMembers.map((m) => ({
    id: m,
    label: m,
  }));
  const onSubmit = async (values: any) => console.log('Hello there');
  const doneTasks = mTask.filter((m) => m.status === 'done').length;
  const filterSpacing = {
    paddingRight: 10,
    paddingBottom: 5,
    width: '100%',
  };
  useEffect(() => {
    setFilteredTasks(getModifiedTasks(props.tasks));
  }, []);

  useEffect(() => {
    if (
      selectedStatus.length === 0 &&
      selectedAssignee.length === 0 &&
      selectedPriority.length === 0 &&
      selectedProjects.length === 0
    ) {
      setFilteredTasks(getModifiedTasks(props.tasks));
      return;
    }
    const allTasks = getModifiedTasks(props.tasks);
    const colorMapper = {};
    for (let pc of priorityColor) {
      colorMapper[pc.name] = pc.code;
    }
    let fTasks: any[] = [];
    for (let task of allTasks) {
      // member
      let found = false;
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
        fTasks.push(task);
        continue;
      }
      // projectName
      found = selectedProjects.find(
        (p) => p.label === task.projectname,
      );
      if (found) {
        fTasks.push(task);
        continue;
      }

      // priority
      found = selectedPriority.find(
        (p) =>
          colorMapper[p.label].toString() ===
          task.priority.toString(),
      );
      if (found) {
        fTasks.push(task);
        continue;
      }

      // status
      found = selectedStatus.find(
        (p) =>
          p.label.split(' ').join('-').toLowerCase() === task.status,
      );
      if (found) {
        fTasks.push(task);
        continue;
      }
    }

    setFilteredTasks(fTasks);
  }, [
    selectedStatus,
    selectedPriority,
    selectedProjects,
    selectedAssignee,
  ]);

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
          Task Status
        </h3>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: 10,
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        <div style={{ display: 'flex' }}>
          <p style={{ paddingRight: 20 }}>
            Total tasks: {mTask.length}
          </p>
          <p>Remaining tasks: {mTask.length - doneTasks}</p>
          <p></p>
        </div>
        <div style={{ display: 'flex' }}>
          <p style={{ paddingRight: 20 }}>
            Running projects: {dashboard.runningProjects}
          </p>
          <p>Completed projects: {dashboard.completedProjects}</p>
          <p></p>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flex: 1,
        }}
      >
        <Form
          onSubmit={onSubmit}
          render={({
            handleSubmit,
            form,
            submitting,
            pristine,
            values,
            submitError,
            hasValidationErrors,
            ...rest
          }) => (
            <>
              <div style={filterSpacing}>
                <MultiSelectComponent
                  container={uniqueStatus}
                  placeholder={'Filter by status'}
                  selected={selectedStatus}
                  setSelected={setSelectedStatus}
                />
              </div>
              <div style={filterSpacing}>
                <MultiSelectComponent
                  container={uniquePriority}
                  placeholder={'Filter by priority'}
                  selected={selectedPriority}
                  setSelected={setSelectedPriority}
                />
              </div>
              <div style={filterSpacing}>
                <MultiSelectComponent
                  container={uniqueProject}
                  placeholder={'Filter by projects'}
                  selected={selectedProjects}
                  setSelected={setSelectedProjects}
                />
              </div>
              <div style={filterSpacing}>
                <MultiSelectComponent
                  container={uniqueMembers}
                  placeholder={'Filter by Assignee'}
                  selected={selectedAssignee}
                  setSelected={setSelectedAssignee}
                />
              </div>
              <div
                style={{
                  paddingBottom: 5,
                  width: '100%',
                }}
              >
                <Field<string>
                  name="dueDate"
                  render={({ input, meta }) => (
                    <DateInput
                      formatDate={(date: Date) =>
                        date.toLocaleDateString()
                      }
                      placeholder="Filter by Due date"
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
                />
              </div>
            </>
          )}
        />
      </div>
      {filteredTasks.length > 0 && (
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
            tasks={filteredTasks}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectStatus;
