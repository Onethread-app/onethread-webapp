import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Tabs, Tab } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { GeneralPage } from './General';
// import { PrefacePage } from './ProjectPreface';
// import { RoomPage } from './Room';
// import { BoardPage } from './Board';
import { updateProjectRole } from '../../../../stores/project/Actions';

const ProjectSettingsPageComponent = (props: any) => {
  // const [allValues, setAllvalues] = React.useState([] as any);

  const [error, setError] = useState({ severity: '', msg: '' });
  const [toastOpen, setToastOpen] = useState(false);

  const onSubmit = async (values: any) => {
    const response = await props.updateProjectRole(values.optionalRole);

    if (response.status === 200) {
        setError({
            severity: 'success', 
            msg: response.message
        });
        setToastOpen(true);

    } else {
        setError({
            severity: 'error', 
            msg: response.message
        });
        setToastOpen(true);
    }
  };
  return (
    <div className="bg-white pa5">
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            key="top"
            open={toastOpen}
            onClose={() => setToastOpen(false)}
        >
            <Alert
                elevation={6}
                variant="filled"
                onClose={() => setToastOpen(false)}
                severity={error.severity === 'error' ? 'error' : 'success'}
            >
                {error.msg}
            </Alert>
        </Snackbar>
      <h3 className="f3 ma0">Project Settings</h3>
      <h3 className="f5 mv4">Project Moderator</h3>
      {/* <h3 className='f6 mv4'>Permission</h3> */}
      <Tabs id="TabsExample" vertical={true}>
        <Tab
          id="general"
          title="Permission"
          panel={<GeneralPage onSubmit={onSubmit} />}
          className="outline-0 w-100"
        />
        {/* <Tab
          id='preface'
          title='Project Preface'
          panel={<PrefacePage onSubmit={onSubmit} />}
          className='outline-0 w-100'
        />
        <Tab
          id='room'
          title='Room'
          panel={<RoomPage onSubmit={onSubmit} />}
          className='outline-0 w-100'
        />
        <Tab
          id='board'
          title='Board'
          panel={<BoardPage onSubmit={onSubmit} />}
          className='outline-0 w-100'
        /> */}
      </Tabs>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    optionalRole: state.companyReducer.currentCompany.optionalRole,
    companyRole: state.companyReducer.currentCompany.role,
  };
};

export const ProjectSettingsPage = connect(mapStateToProps, {
  updateProjectRole,
})(ProjectSettingsPageComponent);
