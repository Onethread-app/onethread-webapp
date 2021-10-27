import { useEffect, useState } from 'react';

import { useTasksTableContext } from '../TasksTableContext';

import { getUniqueList } from 'helpers/utils';
import { SelectItem } from './StyledPanel';

const StatusPanel = () => {
  const { tasks, selectedStatusList, setSelectedStatusList } =
    useTasksTableContext();

  const [allStatus, setAllStatus] = useState<any>([]);

  useEffect(() => {
    setAllStatus(getUniqueList(tasks, 'status'));
  }, [tasks]);

  const handleSelect = (checked, value) => {
    if (checked) {
      setSelectedStatusList((prev) => [...prev, value]);
    } else {
      setSelectedStatusList(
        selectedStatusList.filter((item) => item !== value),
      );
    }
  };

  return (
    <>
      {allStatus.map((status) => (
        <SelectItem key={status.id} className="ttc">
          <label>
            <input
              type="checkbox"
              checked={selectedStatusList.includes(status.id)}
              onChange={(e) => {
                handleSelect((e.target as any).checked, status.id);
              }}
            />{' '}
            {status.label.replace(/-|\s/g, ' ')}
          </label>
        </SelectItem>
      ))}
    </>
  );
};

export default StatusPanel;
