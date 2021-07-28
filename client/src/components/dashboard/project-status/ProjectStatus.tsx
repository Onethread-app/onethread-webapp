import React from 'react';
import { useTranslation } from 'react-i18next';
import './ProjectStatus.scss';
import TasksTable from './TasksTable';

interface IProjectStatus {
  tasks: any;
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
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>(
    'randomField',
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { t } = useTranslation();
  const mTask = props.tasks.map((task) => ({
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

  return (
    <div className="project-status mb5">
      <div className="flex justify-between mb3">
        <h3
          className="f3-ns f5"
          style={{
            color: '#3484F0',
          }}
        >
          {t('app.company.Dashboard.Project-status')}
        </h3>
      </div>
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
          tasks={mTask}
        />
      </div>
    </div>
  );
};

export default ProjectStatus;
