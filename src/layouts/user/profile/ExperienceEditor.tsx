import React, { useState } from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import { JobForm } from './JobDetailsEditor';
import { EducationForm } from './EducationDetailsEditor';

interface ExperienceEditorProps {
  setShowDialog: (val: boolean) => void;
}

export const ExperienceEditor = (props: ExperienceEditorProps) => {

  const [selectedTab, setsSelectedTab] = useState('Job');
  const handleSelectedTab = (id: any) => {
    setsSelectedTab(id);
  };

  return (
    <div>
      <Tabs
        id="TabsExample"
        className="ml4-ns ml3 mt4 mr2"
        onChange={(id) => handleSelectedTab(id)}
        selectedTabId={selectedTab}
      >
        <Tab
          id="Job"
          title="Job"
          panel={
            <JobForm
              setShowDialog={props.setShowDialog}
              edit={false}
            />
          }
          className="outline-0"
        />
        <Tab
          id="Educations"
          title="Educations"
          panel={<EducationForm
            setShowDialog={props.setShowDialog}
            edit={false}
          />}
          className="outline-0"
        />
      </Tabs>
    </div>
  );
};
