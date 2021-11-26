import { isEmpty } from 'lodash';
import moment from 'moment';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';

import { toTitleCase } from 'helpers/utils';

import MemberGroup from 'components/member/MemberGroup';
import TaskPriorityTag from './TaskPriorityTag';
import TaskTagSelect from './TaskTagSelect';
import LabelListView from 'components/label/LabelListView';

const customProjectFilter = (rows, id, filterValue) => {
  return rows.filter((row) =>
    isEmpty(filterValue)
      ? row
      : filterValue.includes(row.original.project._id),
  );
};

const customStatusFilter = (rows, id, filterValue) => {
  return rows.filter((row) =>
    isEmpty(filterValue)
      ? row
      : filterValue.includes(row.original.status._id),
  );
};

const customLabelFilter = (rows, id, filterValue) => {
  return rows.filter(row => {
    if (isEmpty(filterValue)) return row;

    let found = false;
    const rowLabels = row.original.labels.map(label => label._id);
    return rowLabels.some(label => {
      found = filterValue.includes(label);
      return found;
    });
  });
}

const customDueDateFilter = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowYear = new Date(row.original.dueDate).getFullYear();
    const rowMonth = new Date(row.original.dueDate).getMonth();
    const rowDate = new Date(row.original.dueDate).getDate();

    const startOfWeek = moment().startOf('week').toISOString();
    const endOfWeek = moment().endOf('week').toISOString();

    if (
      filterValue.type === 'range' &&
      filterValue.range[0] &&
      filterValue.range[1]
    ) {
      return (
        row.original.dueDate > filterValue.range[0].toISOString() &&
        row.original.dueDate < filterValue.range[1].toISOString()
      );
    } else if (filterValue.type === 'passed') {
      return row.original.dueDate < new Date().toISOString();
    } else if (filterValue.type === 'today') {
      const today = new Date();

      return (
        rowYear === today.getFullYear() &&
        rowMonth === today.getMonth() &&
        rowDate === today.getDate()
      );
    } else if (filterValue.type === 'tomorrow') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return (
        rowYear === tomorrow.getFullYear() &&
        rowMonth === tomorrow.getMonth() &&
        rowDate === tomorrow.getDate()
      );
    } else if (filterValue.type === 'week') {
      return (
        row.original.dueDate > startOfWeek &&
        row.original.dueDate < endOfWeek
      );
    } else return row;
  });
};

export const TaskTableColumns = [
  {
    Header: () => null,
    id: 'expander',
    sticky: 'center',
    Cell: ({ row }) => (
      <span
        {...row.getToggleRowExpandedProps()}
        className="flex items-center"
      >
        {row.original.subtasks?.length > 0 ? (
          row.isExpanded ? (
            <Icon icon="caret-down" />
          ) : (
            <Icon icon="caret-right" />
          )
        ) : null}
      </span>
    ),
  },
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
    filter: customProjectFilter,
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
    Cell: ({ row }) => <TaskTagSelect task={row.original} />,
    filter: customStatusFilter,
  },
  {
    Header: 'Label',
    Footer: 'Label',
    accessor: 'labels',
    sticky: 'center',
    Cell: ({ row }) => {
      return <LabelListView labels={row.original.labels} />
    },
    filter: customLabelFilter,
  },
  {
    Header: 'Created At',
    Footer: 'Created At',
    accessor: 'createdAt',
    Cell: ({ value }) => {
      return value
        ? moment(value).format('MMM DD, YYYY')
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
        ? moment(value).format('MMM DD, YYYY')
        : 'Not scheduled';
    },
    filter: customDueDateFilter,
    sticky: 'center',
  },
];
