import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { GeneralPage } from './General';
import { PrefacePage } from './ProjectPreface';
import { RoomPage } from './Room';
import { BoardPage } from './Board';

const ProjectSettingsPageComponent = () => (
  <div className='bg-white pa5'>
    <h3 className='f3 ma0'>Project Settings</h3>
    <h3 className='f5 mv4'>Project Moderator</h3>
    <h3 className='f6 mv4'>Permission</h3>
    <Tabs id='TabsExample' vertical={true}>
      <Tab
        id='general'
        title='General'
        panel={<GeneralPage onSubmit='' />}
        className='outline-0 w-100'
      />
      <Tab
        id='preface'
        title='Project Preface'
        panel={<PrefacePage />}
        className='outline-0 w-100'
      />
      <Tab
        id='room'
        title='Room'
        panel={<RoomPage />}
        className='outline-0 w-100'
      />
      <Tab
        id='board'
        title='Board'
        panel={<BoardPage />}
        className='outline-0 w-100'
      />
    </Tabs>
  </div>
);

export const ProjectSettingsPage = connect(
  null,
  null
)(ProjectSettingsPageComponent);
