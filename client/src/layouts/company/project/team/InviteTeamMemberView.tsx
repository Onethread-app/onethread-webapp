import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { makeStyles } from '@material-ui/core/styles';
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CloseIcon from '@material-ui/icons/Close';
import './InviteTeamMemberView.scss';

const useStyles = makeStyles({
  button: {
    textTransform: 'none',
  },
});

interface IInviteTeamMemberView {
  setShowDialog: () => void;
}

export default function InviteTeamMemberView(
  props: IInviteTeamMemberView,
) {
  const [inputType, setInputType] = React.useState('single');
  const classes = useStyles();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            marginTop: '4px',
            borderRadius: '2px',
            backgroundColor: '#F7F6FF',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '160px',
          }}
        >
          <div
            onClick={() => props.setShowDialog()}
            style={{ textAlign: 'right', cursor: 'pointer' }}
          >
            <CloseIcon />
          </div>
          <label style={{ marginTop: '40px', marginBottom: '5px' }}>
            Invite Team Members to
          </label>
          <label
            style={{
              marginBottom: '5px',
              fontSize: '25px',
              color: '#5674CC',
            }}
          >
            Demo Company
          </label>
          <label
            style={{
              marginBottom: '5px',
              fontSize: '10px',
            }}
          >
            Invite your team members who are not using Tigrow to the
            workspace
          </label>
        </div>
        <div
          style={{
            margin: '45px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label className="b mt3 mb3">
            Invite Your Team Members
          </label>
          {inputType === 'single' && (
            <div>
              <TextField
                id="email"
                placeholder="e.g. jon@gmail.com"
                variant="outlined"
                fullWidth={true}
              />
              <div>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      marginLeft: '3px',
                      cursor: 'pointer',
                      color: '#3F51B5',
                    }}
                    onClick={() => setInputType('multiple')}
                  >
                    Invite multiple members at once
                  </div>
                </div>
              </div>
            </div>
          )}
          {inputType === 'multiple' && (
            <div>
              <textarea
                // style={{ width: '100%' }}
                placeholder="e.g. jon@gmail.com, demo@outlook.com"
                rows={4}
              ></textarea>
              <div>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      marginLeft: '3px',
                      cursor: 'pointer',
                      color: '#3F51B5',
                    }}
                    onClick={() => setInputType('single')}
                  >
                    Invite single
                  </div>
                </div>
              </div>
            </div>
          )}
          <label
            style={{
              marginLeft: '3px',
              textAlign: 'center',
              marginTop: '50px',
              fontWeight: 'bold',
              fontSize: '19px',
            }}
          >
            or
          </label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '50px',
            }}
          >
            <div
              style={{
                borderRadius: '8px',
                border: '1px dashed #3F51B5',
                padding: '10px',
                display: 'flex',
                width: '200px',
                marginBottom: '50px',
                backgroundColor: '#F7F6FF',
              }}
            >
              <Button
                fullWidth={true}
                className={classes.button}
                component="label"
              >
                <AttachmentIcon fontSize="small" color="primary" />
                <div className="b" style={{ marginLeft: '3px' }}>
                  Attach CSV
                </div>
                <input type="file" style={{ display: 'none' }} />
              </Button>
            </div>
          </div>
          <Button variant="contained" color="primary">
            Invite
          </Button>
        </div>
      </div>
    </div>
  );
}
