import { format } from 'date-fns';

import { toTitleCase } from 'helpers/utils';

import StatusTag from './StatusTag';

export const ProjectTableColumns = [
  {
    Header: 'Project Name',
    Footer: 'Project Name',
    accessor: 'name',
    sticky: 'left',
    Cell: ({ value }) => toTitleCase(value),
  },
  {
    Header: 'Status',
    Footer: 'Status',
    accessor: 'status',
    sticky: 'center',
    Cell: ({ value }) => <StatusTag status={value} />,
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
    accessor: 'deadline',
    Cell: ({ value }) => {
      return value
        ? format(new Date(value), 'dd/MM/yyyy')
        : 'Not Set';
    },
    sticky: 'center',
  },
  {
    Header: 'Tasks',
    Footer: 'Tasks',
    accessor: 'totalTasks',
    sticky: 'center',
  },
];
