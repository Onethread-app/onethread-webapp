import { useEffect, useState } from 'react';
import { uniqBy } from 'lodash';

import { useTasksTableContext } from '../TasksTableContext';
import { IAccount } from 'stores/task/Reducer';

import { SelectItem } from './StyledPanel';

const AssigneePanel = () => {
  const { tasks, selectedAssigneeList, setSelectedAssigneeList } = useTasksTableContext();

  const [allAssignee, setAllAssignee] = useState<any>([]);

  useEffect(() => {
    let assignees: any = [];
    assignees = tasks.map(task => task.members.map(member => member.assignedPerson)).flat();
    setAllAssignee(
      uniqBy(
        assignees.map((d: IAccount) => ({
          id: d._id,
          label: d.firstName + ' ' + d.lastName,
        })),
        'id',
      ),
    );
  }, [tasks]);

  const handleSelect = (checked, value) => {
    if (checked) {
      setSelectedAssigneeList((prev) => [...prev, value]);
    } else {
      setSelectedAssigneeList(
        selectedAssigneeList.filter((item) => item !== value),
      );
    }
  };

  return (
    <>
      {allAssignee.map((status) => (
        <SelectItem key={status.id} className="ttc">
          <label>
            <input
              type="checkbox"
              checked={selectedAssigneeList.includes(status.id)}
              onChange={(e) => {
                handleSelect((e.target as any).checked, status.id);
              }}
            />{' '}
            {status.label}
          </label>
        </SelectItem>
      ))};
    </>
  );
};

export default AssigneePanel;
