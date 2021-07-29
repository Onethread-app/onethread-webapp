import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialogSlide({ open, handleClickOpen }) {
  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClickOpen}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {'Permission Error'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You don't have any permission to access this task
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickOpen} color="primary">
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
