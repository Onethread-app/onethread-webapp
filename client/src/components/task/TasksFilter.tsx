import { Dispatch, SetStateAction } from 'react';

import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';

import { AlignCenter } from 'components/UtilComponents';
import FilterPanel from './panels/FilterPanel';

interface ITasksFilter {
  filterOpen: boolean;
  setFilterOpen: Dispatch<SetStateAction<boolean>>;
}

const TasksFilter = (props: ITasksFilter) => {
  const { filterOpen, setFilterOpen } = props;

  return (
    <div onClick={() => setFilterOpen(true)}>
      <Popover
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        interactionKind="click"
        position="bottom"
        popoverClassName="mb0"
        content={<FilterPanel />}
        target={<AlignCenter>Filter</AlignCenter>}
      />
    </div>
  );
};

export default TasksFilter;
