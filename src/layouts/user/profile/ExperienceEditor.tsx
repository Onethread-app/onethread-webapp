import React, { useState } from 'react';
import { Button } from '@blueprintjs/core';
import { JobForm } from './JobDetailsEditor';
import { EducationForm } from './EducationDetailsEditor';

interface ExperienceEditorProps {
  setShowDialog: (val: boolean) => void;
}

export const ExperienceEditor = (props: ExperienceEditorProps) => {

  const [selectedJob, setSelectedJob] = useState(true);
  const [selectedEducation, setSelectedEducation] = useState(false);

  return (
    <div className="mt5">
      <div className="flex-ns ph4">
        <Button
          active={selectedJob}
          className="ba bw1 pa2 w-30-ns w-100 bp3-minimal"
          style={{ color: 'white' }}
          onClick={() => {
            setSelectedEducation(false);
            setSelectedJob(true);
          }}>
          Job
          </Button>
        <Button
          active={selectedEducation}
          className="ba bw1 pa2 w-30-ns w-100 bp3-minimal ml3-l"
          style={{ color: 'white' }}
          onClick={() => {
            setSelectedJob(false);
            setSelectedEducation(true);
          }} >
          Education
          </Button>
      </div>
      {selectedJob &&
        <div className="ph4 mt2">
          <JobForm
            setShowDialog={props.setShowDialog}
            edit={false}
          />
        </div>
      }
      {selectedEducation &&
        <div className="ph4 mt2">
          <EducationForm
            setShowDialog={props.setShowDialog}
            edit={false}
          />
        </div>
      }
    </div>
  );
};
