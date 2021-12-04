import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isEmpty } from 'lodash';

import PanelView from './PanelView';
import { useTasksTableContext } from '../TasksTableContext';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {
  PanelsContainer,
  PanelTitle,
  PanelsTitleContainer,
} from './StyledPanel';

const FilterPanel = () => {
  const {
    selectedProjectList,
    selectedDueDateOption,
    selectedStatusList,
    selectedLabelList
  } = useTasksTableContext();
  const [selectedPanel, setSelectedPanel] = useState<number | null>(
    null,
  );
  const { projectId }: any = useParams();

  return (
    <PanelsContainer>
      {selectedPanel === null ? (
        <PanelsTitleContainer>
          <PanelTitle
            onClick={() => setSelectedPanel(0)}
            active={!isEmpty(selectedStatusList)}
          >
            <p>Status</p>
            <ChevronRightIcon />
          </PanelTitle>
          <PanelTitle
            onClick={() => setSelectedPanel(1)}
            active={!isEmpty(selectedDueDateOption)}
          >
            <p>Due Date</p>
            <ChevronRightIcon />
          </PanelTitle>
          {!projectId && (
            <PanelTitle
              onClick={() => setSelectedPanel(2)}
              active={!isEmpty(selectedProjectList)}
            >
              <p>Project</p>
              <ChevronRightIcon />
            </PanelTitle>
          )}
          <PanelTitle
            onClick={() => setSelectedPanel(3)}
            active={!isEmpty(selectedLabelList)}
          >
            <p>Label</p>
            <ChevronRightIcon />
          </PanelTitle>
          <PanelTitle
            onClick={() => setSelectedPanel(4)}
            active={!isEmpty(selectedDueDateOption)}
          >
            <p>Assignee</p>
            <ChevronRightIcon />
          </PanelTitle>
        </PanelsTitleContainer>
      ) : (
        <PanelView
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
      )}
    </PanelsContainer>
  );
};

export default FilterPanel;
