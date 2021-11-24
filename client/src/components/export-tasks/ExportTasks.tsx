import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';

import SuspenseLoader from 'components/loader/SuspenseLoader';
import { priorityColor } from 'stores/UtilsActions';
import { find } from 'lodash';
import moment from 'moment';
import { ITask } from 'stores/task/Reducer';
import Tooltip from '@material-ui/core/Tooltip';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { isMobileOnly } from 'react-device-detect';

interface ITaskForExport {
  name: string;
  priority: string;
  status: string;
  project: string;
  createdAt: string;
  dueDate: string;
  assignee: string[];
}

interface IExportTasksDialog {
  loading?: boolean;
  data: ITask[];
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

const ExportTasksDialog = (props: IExportTasksDialog) => {
  const { data, name } = props;
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
    if (data.length > 0) {
      const modifiedData = data.map((d: ITask) => {
        return {
          name: d.name,
          priority: find(priorityColor, ['code', d.priority])!.name,
          status: d.status.name,
          dueDate: moment(d.dueDate).format('MMMM Do YYYY, h:mm a'),
          createdAt: moment(d.createdAt).format(
            'MMMM Do YYYY, h:mm a',
          ),
          project: d.project.name,
          assignee: d.members.map(
            (m) => `${m.assignedPerson.firstName} ${m.assignedPerson.lastName}`,
          ),
        };
      });
      setProcessedData(modifiedData);
      setProcessing(false);
    }
    if (data.length === 0) {
      setProcessing(false);
    }
  }, [data]);

  return (
    <div className={`w-100 h-100 flex items-center justify-center`}>
      {processing ? (
        <div className={`w-third flex flex-column justify-center tc`}>
          <span>Processing...</span>
          <SuspenseLoader insideComponent />
        </div>
      ) : processedData.length > 0 ? (
        <CSVLink {...csvReport} className={`f4`}>
          Export to CSV
        </CSVLink>
      ) : (
        <span>Task List Empty</span>
      )}
    </div>
  );
};
interface IExportTasksIconProps {
  data: ITask[];
  name: string;
}

const ExportTasks = (props: IExportTasksIconProps) => {
  const { data, name } = props;
  const [openExportDialog, setOpenExportDialog] = useState<boolean>(false);

  return (
    <>
      <Tooltip title="Export" placement='top'>
        <Icon
          icon={'export'}
          className={`ml3 pointer`}
          aria-label={`Export`}
          onClick={() => { setOpenExportDialog(true) }}
        />
      </Tooltip>
      {openExportDialog && (
        <Dialog
          isOpen={openExportDialog}
          onClose={() => setOpenExportDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className={`pb0`}
          style={{
            width: isMobileOnly ? '95%' : '420px',
            maxWidth: '420px',
            height: '173px',
            background: '#ffffff',
            borderRadius: '20px',
          }}
        >
          <ExportTasksDialog
            data={data}
            name={name}
          />
        </Dialog>
      )}
    </>
  )
}

export default ExportTasks;