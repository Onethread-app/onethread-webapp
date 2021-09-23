import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

import SuspenseLoader from 'components/loader/SuspenseLoader';
import { priorityColor } from 'stores/UtilsActions';
import { find } from 'lodash';
import moment from 'moment';

export interface ITaskMember {
  firstName: string;
  lastName: string;
  _id: string;
  profileImage: string;
}

export interface ICompanyTask {
  boardId: string;
  company: { _id: string; uniqueName: string };
  createdAt: string;
  dueDate: string;
  name: string;
  priority: number;
  project: {
    name: string;
    _id: string;
  };
  status: string;
  members: ITaskMember[];
  doneSubtasks: number;
  totalSubtasks: number;
}

interface ITaskForExport {
  name: string;
  priority: string;
  status: string;
  project: string;
  createdAt: string;
  dueDate: string;
  assignee: string[];
}

interface IExportTasks {
  loading: boolean;
  data: ICompanyTask[];
  name: string;
}

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Priority', key: 'priority' },
  { label: 'Status', key: 'status' },
  { label: 'Assignee', key: 'assignee' },
  { label: 'Project', key: 'project' },
  { label: 'Created At', key: 'createdAt' },
  { label: 'Due Date', key: 'dueDate' },
];

const ExportTasks = (props: IExportTasks) => {
  const { loading, data, name } = props;
  const [processing, setProcessing] = useState<boolean>(true);
  const [processedData, setProcessedData] = useState<
    ITaskForExport[]
  >([]);

  const csvReport = {
    data: processedData,
    headers,
    filename: `${name}_tasks.csv`,
  };

  useEffect(() => {
    if (loading === false && data.length > 0) {
      const modifiedData = data.map((d: ICompanyTask) => ({
        name: d.name,
        priority: find(priorityColor, ['code', d.priority])!.name,
        status: d.status.replace(/-|\s/g, ' '),
        dueDate: moment(d.dueDate).format('MMMM Do YYYY, h:mm a'),
        createdAt: moment(d.createdAt).format(
          'MMMM Do YYYY, h:mm a',
        ),
        project: d.project.name,
        assignee: d.members.map(
          (m) => `${m.firstName} ${m.lastName}`,
        ),
      }));
      setProcessedData(modifiedData);
      setProcessing(false);
    }
    if (loading === false && data.length === 0) {
      setProcessing(false);
    }
  }, [data, loading]);

  return (
    <div className='w-100 h-100 flex items-center justify-center'>
      {processing ? (
        <div className='w-third flex flex-column justify-center tc'>
          <span>Processing...</span>
          <SuspenseLoader insideComponent />
        </div>
      ) : processedData.length > 0 ? (
        <CSVLink {...csvReport} className='f4'>
          Export to CSV
        </CSVLink>
      ) : (
        <span>Task List Empty</span>
      )}
    </div>
  );
};

export default ExportTasks;
