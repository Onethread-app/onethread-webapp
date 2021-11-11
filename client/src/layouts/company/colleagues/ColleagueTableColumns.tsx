import { toTitleCase } from 'helpers/utils';

export const ColleagueTableColumns = [
  {
    Header: 'Name',
    Footer: 'Name',
    accessor: 'name',
    sticky: 'left',
    Cell: ({ row, value }) => {
      return (
        <span className="flex justify-start items-center">
          {toTitleCase(row.original.name) + '  '}
        </span>
      );
    },
  },
  {
    Header: 'Email',
    Footer: 'Email',
    accessor: 'email',
    Cell: ({ value }) => (value ? value : ''),
    sticky: 'center',
  },
  {
    Header: 'Division',
    Footer: 'Division',
    accessor: 'division',
    Cell: ({ value }) => (value !== 'false' ? value : ''),
    sticky: 'center',
  },
  {
    Header: 'Position',
    Footer: 'Position',
    accessor: 'position',
    Cell: ({ value }) => (value !== 'false' ? value : ''),
    sticky: 'center',
  },
  {
    Header: 'Role',
    Footer: 'Role',
    accessor: 'role',
    sticky: 'center',
    Cell: ({ value }) =>
      value === 'admin'
        ? 'Admin'
        : value === 'projectModerator'
        ? 'Project Moderator'
        : value === 'employee'
        ? 'Employee'
        : value === 'superAdmin'
        ? 'Super Admin'
        : 'Teammate',
  },
];
