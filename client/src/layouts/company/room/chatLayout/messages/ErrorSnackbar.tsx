import React, { Dispatch, SetStateAction } from 'react';

import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export interface State extends SnackbarOrigin {
  open: boolean;
}

const ErrorSnackbar = (props: {
  messageError: string;
  setMessageError: Dispatch<SetStateAction<string>>;
}) => {
  const classes = useStyles();
  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  React.useEffect(() => {
    const timer = setTimeout(() => {}, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setMessageError('');
    setState({ ...state, open: false });
  };
  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {props.messageError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ErrorSnackbar;
