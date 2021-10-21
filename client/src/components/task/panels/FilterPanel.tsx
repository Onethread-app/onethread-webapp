import { useState } from 'react';
import { isEmpty } from 'lodash';

import { useCompanyTasksContext } from '../CompanyTasksContext';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {
  PanelsContainer,
  PanelTitle,
  PanelsTitleContainer,
} from './StyledPanel';
import PanelView from './PanelView';

const FilterPanel = () => {
  const {
    selectedProjectList,
    selectedDueDateOption,
    selectedStatusList,
  } = useCompanyTasksContext();
  const [selectedPanel, setSelectedPanel] = useState<number | null>(
    null,
  );

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
          <PanelTitle
            onClick={() => setSelectedPanel(2)}
            active={!isEmpty(selectedProjectList)}
          >
            <p>Project</p>
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
