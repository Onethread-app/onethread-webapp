import { format } from 'date-fns';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { toTitleCase } from 'helpers/utils';

import StatusTag from './StatusTag';
import { favouriteProject } from 'stores/project/Actions';
import { useDispatch, useSelector } from 'react-redux';

export const ProjectTableColumns = [
  {
    Header: 'Project Name',
    Footer: 'Project Name',
    accessor: 'name',
    sticky: 'left',
    Cell: ({ row, value }) => {
      const dispatch = useDispatch();
      const currentCompanyMember = useSelector(
        (state: any) => state.companyReducer.currentCompany.member,
      );
      const pid = row.original._id;
      const member = row.original.member ?? currentCompanyMember;
      const isFavourite = !row.original.isFavourite;
      return (
        <div className="flex justify-start items-center">
          {toTitleCase(value) + '  '}
          {row.original.isFavourite ? (
            <StarIcon
              style={{ color: 'gold' }}
              onClick={() => {
                dispatch(
                  favouriteProject({ pid, member, isFavourite }),
                );
              }}
            />
          ) : (
            <StarBorderIcon
              onClick={() => {
                dispatch(
                  favouriteProject({ pid, member, isFavourite }),
                );
              }}
            />
          )}
        </div>
      );
    },
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
