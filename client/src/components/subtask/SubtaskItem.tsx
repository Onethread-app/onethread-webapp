import React from 'react';
import moment from 'moment';

import { Checkbox } from '@blueprintjs/core/lib/esm/components/forms/controls';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface ISuccessSnackbar {
  open: boolean;
  handleClose: () => void;
  snackbarMessage: string;
}

const SuccessSnackbar = (props: ISuccessSnackbar) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={3000}
      onClose={props.handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={props.handleClose} severity="success">
        {props.snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

interface ISubtaskItemProps {
  subtask: any;
}

const SubtaskItem = (props: ISubtaskItemProps) => {
  const [done, setDone] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const { subtask } = props;

  const handleOnChange = async (event: any) => {
    setDone(event.target.checked);
    const headers = tokenConfig();
    if ((headers.headers as any).Authorization) {
      const response = await tigrowApi.put(
        `accounts/${subtask._id}/done`,
        { done: event.target.checked },
        headers,
      );
      if (response.status === 200) {
        setShowSnackbar(true);
        setSnackbarMessage(response.data.message);
      } else {
        setShowSnackbar(true);
        setSnackbarMessage('There was an error');
      }
    }
  };

  return (
    <div className="subtask-item flex items-center justify-between pa1">
      <Checkbox
        className="ws-break"
        value={subtask._id}
        checked={done}
        label={subtask.name}
        large={true}
        style={{
          textDecoration: done ? 'line-through' : 'none',
          minWidth: '180px',
          fontSize: '14px',
          margin: 0,
        }}
        onChange={async (event) => await handleOnChange(event)}
      />
      <div className="flex">
        <div
          className="tc truncate mr3"
          style={{ maxWidth: '100px' }}
        >
          {subtask.taskId.project.name}
        </div>
        <div
          className={'flex items-center justify-end mr3'}
          style={{ width: '100px' }}
        >
          <span
            className="bp3-tag"
            style={{
              backgroundColor:
                moment() > moment(subtask.dueDate)
                  ? 'red'
                  : 'lightsteelblue',
              color:
                moment() > moment(subtask.dueDate)
                  ? '#fff'
                  : 'inherit',
            }}
          >
            {subtask.dueDate
              ? moment(subtask.dueDate).fromNow()
              : 'Not Set'}
          </span>
        </div>
      </div>
      {showSnackbar && (
        <SuccessSnackbar
          open={showSnackbar}
          handleClose={() => setShowSnackbar(false)}
          snackbarMessage={snackbarMessage}
        />
      )}
    </div>
  );
};

export default SubtaskItem;
