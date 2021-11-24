import { uniqBy } from 'lodash';
import {
  useEffect,
  useState
} from 'react';
import { useTasksTableContext } from '../TasksTableContext';
import { SelectItem } from './StyledPanel';

const LabelPanel = () => {
  const { tasks,
    selectedLabelList,
    setSelectedLabelList
  } = useTasksTableContext();
  const [allLabels, setAllLabels] = useState<any>([]);

  const handleSelect = (checked, value) => {
    if (checked) {
      setSelectedLabelList &&
        setSelectedLabelList((prev) => [...prev, value]);
    } else {
      setSelectedLabelList &&
        setSelectedLabelList(
          selectedLabelList?.filter((item) => item !== value),
        );
    }
  };

  useEffect(() => {
    let taskLabels: any = [];
    taskLabels = tasks.map((task) => {
      return task.labels.map((label) => label)
    }).flat();
    setAllLabels(
      uniqBy(
        taskLabels.map((d: any) => ({
          id: d._id,
          label: d.name,
        })),
        'id',
      ),
    );
  }, [tasks]);

  return (
    <>
      {allLabels.map((label) => (
        <SelectItem key={label.id} className="ttc">
          <label>
            <input
              type="checkbox"
              checked={selectedLabelList?.includes(label.id)}
              onChange={(e) =>
                handleSelect(e.target.checked, label.id)}
            />
            {label.label}
          </label>
        </SelectItem>
      ))}
    </>
  )
}

export default LabelPanel
