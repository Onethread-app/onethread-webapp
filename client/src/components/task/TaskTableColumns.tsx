import { format } from 'date-fns';

import { toTitleCase } from 'helpers/utils';

import MemberGroup from 'components/member/MemberGroup';
import TaskStatusTag from './TaskStatusTag';
import TaskPriorityTag from './TaskPriorityTag';

export const TaskTableColumns = [
  {
    Header: 'Task Name',
    Footer: 'Task Name',
    accessor: 'name',
    sticky: 'left',
    Cell: ({ value }) => toTitleCase(value),
  },
  {
    Header: 'Project',
    Footer: 'Project',
    accessor: 'project',
    sticky: 'center',
    Cell: ({ value }) => value.name,
  },
  {
    Header: 'Assignee',
    Footer: 'Assignee',
    accessor: 'members',
    sticky: 'center',
    Cell: ({ value }) =>
      value.length > 0 ? (
        <MemberGroup members={value} small />
      ) : (
        'Not Assigned'
      ),
  },
  {
    Header: 'Priority',
    Footer: 'Priority',
    accessor: 'priority',
    sticky: 'center',
    Cell: ({ value }) => <TaskPriorityTag priority={value} />,
  },
  {
    Header: 'Status',
    Footer: 'Status',
    accessor: 'status',
    sticky: 'center',
    Cell: ({ value }) => <TaskStatusTag status={value} />,
  },
  {
    Header: 'Created At',
    Footer: 'Created At',
    accessor: 'createdAt',
    Cell: ({ value }) => {
      return value
        ? format(new Date(value), 'dd/MM/yyyy')
        : 'Not scheduled';
    },
    sticky: 'center',
  },
  {
    Header: 'Due Date',
    Footer: 'Due Date',
    accessor: 'dueDate',
    Cell: ({ value }) => {
      return value
        ? format(new Date(value), 'dd/MM/yyyy')
        : 'Not scheduled';
    },
    sticky: 'center',
  },
];
