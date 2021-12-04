import { Dispatch, SetStateAction } from 'react';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import StatusPanel from './StatusPanel';
import DueDatePanel from './DueDatePanel';
import ProjectsPanel from './ProjectsPanel';
import LabelPanel from './LabelPanel';
import AssigneePanel from './AssigneePanel';
import { BackButton, PanelViewContainer } from './StyledPanel';

interface IPanelView {
  selectedPanel: number | null;
  setSelectedPanel: Dispatch<SetStateAction<number | null>>;
}

const PanelView = (props: IPanelView) => {
  const { selectedPanel, setSelectedPanel } = props;

  return (
    <PanelViewContainer>
      <BackButton
        onClick={() => {
          setSelectedPanel(null);
        }}
      >
        <ChevronLeftIcon fontSize={'small'} />
        Back
      </BackButton>
      {
        {
          0: <StatusPanel />,
          1: <DueDatePanel />,
          2: <ProjectsPanel />,
          3: <LabelPanel />,
          4: <AssigneePanel />,
        }[selectedPanel!]
      }
    </PanelViewContainer>
  );
};

export default PanelView;
