import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { CSVReader } from 'react-papaparse';
import { ICompany } from 'stores/company/Reducer';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import './InviteColleagueView.scss';

const ErrorLabel = () => {
  return (
    <div style={{ margin: '5px', color: 'red' }}>
      <label>Required</label>
    </div>
  );
};

const useStyles = makeStyles({
  button: {
    textTransform: 'none',
  },
});

interface IInviteColleagueView {
  setshowDialogForInviteColleague: () => void;
  colleagueInviteSuccess: () => void;
}

interface IInviteColleagueViewInternalProps
  extends IInviteColleagueView {
  inviteColleagueInBulk: (emails: any) => void;
  currentCompany: ICompany['name'];
  inviteColleagueSuccess?: boolean;
}

function _InviteColleagueView(
  props: IInviteColleagueViewInternalProps,
) {
  const [inputType, setInputType] = React.useState('single');
  const [emails, setEmails] = React.useState([]);
  const [emailsCsv, setEmailCsv] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [emailValidation, setEmailValidation] = React.useState(false);

  const classes = useStyles();

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  React.useEffect(() => {
    props.inviteColleagueSuccess &&
      setSuccess(true) &&
      setLoading(false);
  }, [props.inviteColleagueSuccess]);

  const handleOnDrop = (data: any, file) => {
    try {
      // if (file.type === 'text/csv') {
      const parsedData = data.map((element) => {
        delete element.errors;
        delete element.meta;
        return element.data[0];
      });
      setEmailCsv(parsedData.slice(0, parsedData.length - 1));
    } catch (error) {
      //TODO: catch console in logger.
    }
  };

  const handleOnError = (
    err: any,
    file: any,
    inputElem: any,
    reason: any,
  ) => {
    //TODO: catch console in logger.
  };

  const handleOnRemoveFile = (data: any) => {
    //TODO: catch console in logger.
  };

  const invateColleague = async () => {
    setLoading(true);
    if (emails.length === 0 && emailsCsv.length === 0) {
      setError(true);
      setLoading(false);
    } else {
      if (emailsCsv.length === 0 && emails.length !== 0) {
        !validateEmail(emails[0]) && setEmailValidation(true);
        setLoading(false);
      }
      setError(false);
    }

    if (emails.length > 0) {
      if (validateEmail(emails[0]) && emails.length > 0) {
        await props.inviteColleagueInBulk(emails);
        setEmailValidation(false);
      }
    }
    if (emailsCsv.length > 0) {
      await props.inviteColleagueInBulk(emailsCsv);
    }
  };

  const handleEmail = (event: any) => {
    setEmails(event.target.value.split(','));
  };

  return (
    <div>
      {!success ? (
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
              onClick={() => props.setshowDialogForInviteColleague()}
              style={{ textAlign: 'right', cursor: 'pointer' }}
            >
              <CloseIcon />
            </div>
            <label style={{ marginTop: '40px', marginBottom: '5px' }}>
              Invite Colleagues to
            </label>
            <label
              style={{
                marginBottom: '5px',
                fontSize: '25px',
                color: '#5674CC',
              }}
            >
              {props.currentCompany}
            </label>
            <label
              style={{
                marginBottom: '5px',
                fontSize: '10px',
              }}
            >
              Invite your Co-workers who are not using Onethread to
              the workspace

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
                  onChange={handleEmail}
                />
                {error && <ErrorLabel />}
                {emailValidation && (
                  <div style={{ margin: '5px', color: 'red' }}>
                    Please Enter a valid email
                  </div>
                )}
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
              <div
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div className="container">
                  <div className="comment">
                    <textarea
                      className="textinput"
                      placeholder="e.g. jon@gmail.com, demo@outlook.com"
                      rows={4}
                      onChange={handleEmail}
                    ></textarea>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      marginTop: '5px',
                      fontSize: '11px',
                    }}
                  >
                    <div>
                      <div>
                        Please separate multiple email with commas
                      </div>
                    </div>
                  </div>
                </div>
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
                      <div>Invite single</div>
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
                marginBottom: '50px',
              }}
            >
              <CSVReader
                onDrop={handleOnDrop}
                onError={handleOnError}
                addRemoveButton
                onRemoveFile={handleOnRemoveFile}
              >
                <div
                  style={{
                    borderRadius: '8px',
                    border: '1px dashed #3F51B5',
                    padding: '10px',
                    display: 'flex',
                    width: '200px',
                    backgroundColor: '#F7F6FF',
                  }}
                >
                  <Button
                    fullWidth={true}
                    className={classes.button}
                    component="label"
                  >
                    <AttachmentIcon
                      fontSize="small"
                      color="primary"
                    />
                    <div className="b" style={{ marginLeft: '3px' }}>
                      Attach CSV
                    </div>
                    <input type="file" style={{ display: 'none' }} />
                  </Button>
                </div>
              </CSVReader>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={invateColleague}
            >
              Invite
            </Button>
            {loading && <LinearProgress color="secondary" />}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            textAlign: 'center',
            flexDirection: 'column',
            margin: '20px',
          }}
        >
          <label style={{ fontSize: '20px' }}>
            Invitation Successfully Sent To Join{' '}
            {props.currentCompany}
          </label>
          <div style={{ maxWidth: '435px', marginTop: '15px' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                props.setshowDialogForInviteColleague();
                props.colleagueInviteSuccess();
                setSuccess(false);
              }}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    inviteColleagueSuccess:
      state.companyReducer.colleagueInviteSuccess,
  };
};

export const InviteColleagueView = connect(
  mapStateToProps,
  null,
)(_InviteColleagueView);
