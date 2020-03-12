import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { AssociateList } from './AssociateList';
import { PendingAssociateList } from './PendingAssociateList';

export const AssociatesPage = () => (
  <div className="ph4 w-100">
    <h1 className="f3">My Associates</h1>
    <Tabs id="associatesTab">
      <Tab
        id="associates"
        title="Associates"
        panel={<AssociateList />}
        className="outline-0"
      />
      <Tab
        id="pending_associates"
        title="Pending Associates"
        panel={<PendingAssociateList />}
        className="outline-0"
      />
    </Tabs>
  </div>
);