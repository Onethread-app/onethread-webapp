import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Snackbar, {
  SnackbarOrigin,
} from '@material-ui/core/Snackbar/Snackbar';

import { resetContactFormResponse } from '../../stores/landing/Actions';

export interface State extends SnackbarOrigin {
  open: boolean;
}

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

const SuccessMessageComponent = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  useEffect(() => {
    const timer = setTimeout(() => {
      props.resetContactFormResponse();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    props.resetContactFormResponse();
    setState({ ...state, open: false });
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Your mail has been sent successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export const SuccessMessage = connect(null, {
  resetContactFormResponse,
})(SuccessMessageComponent);
