import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { MyProject } from './MyProjects';
import { PendingProjectRequest } from './request/Index';

export const ProjectPage = () => (
  <div className="ph5">
    <h3 className="f3">Projects</h3>
    <Tabs
      id="TabsExample"
    >
      <Tab
        id="MyProjects"
        title="My Projects"
        panel={<MyProject />}
        className="outline-0 mt4"
      />
      <Tab
        id="PendingProject"
        title="Pending Projects"
        panel={<PendingProjectRequest />}
        className="outline-0 mt4"
      />
    </Tabs>
  </div>
);
