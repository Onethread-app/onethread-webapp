import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { MyProjectPage } from './MyProjects';
import { ProjectRequest } from './request/Index';

export const ProjectPage = () => (
  <div className="ph5">
    <h3 className="f3">Projects</h3>
    <Tabs
      id="TabsExample"
    >
      <Tab
        id="MyProjects"
        title="My Projects"
        panel={<MyProjectPage />}
        className="outline-0 mt4"
      />
      <Tab
        id="PendingProject"
        title="Pending Projects"
        panel={<ProjectRequest />}
        className="outline-0 mt4"
      />
    </Tabs>
  </div>
);
