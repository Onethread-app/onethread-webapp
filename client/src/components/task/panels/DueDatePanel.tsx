import { useEffect } from 'react';
import { useTasksTableContext } from '../TasksTableContext';

import Grid from '@material-ui/core/Grid';

import { SelectItem } from './StyledPanel';
import { DateRangeInput } from '@blueprintjs/datetime/lib/esm/dateRangeInput';
import { DateRange } from '@blueprintjs/datetime/lib/esm/common/dateRange';

const DueDatePanel = () => {
  const {
    selectedDueDateOption,
    setSelectedDueDateOption,
    selectedDueDateRange,
    setSelectedDueDateRange,
  } = useTasksTableContext();

  const handleRangeChange = (range: DateRange) => {
    setSelectedDueDateRange(range);
  };
  const dueDateFilterOptions = [
    { id: 'passed', label: 'Passed' },
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'week', label: 'This week' },
    { id: 'range', label: 'From - To' },
  ];
  const handleSelect = (e) => {
    setSelectedDueDateOption(e.target.value);
  };

  useEffect(() => {
    if (selectedDueDateOption !== 'range') {
      setSelectedDueDateRange([null, null]);
    }
  }, [selectedDueDateOption]);

  useEffect(() => {
    if (
      selectedDueDateRange[0] !== null ||
      selectedDueDateRange[1] !== null
    ) {
      setSelectedDueDateOption('range');
    }
  }, [selectedDueDateRange]);

  return (
    <>
      {dueDateFilterOptions.map((option) => (
        <div key={option.id} onChange={handleSelect}>
          {option.id !== 'range' ? (
            <SelectItem className="ttc">
              <label>
                <input
                  type="radio"
                  name="dueDate"
                  value={option.id}
                  checked={selectedDueDateOption === option.id}
                  onChange={() => {}}
                />{' '}
                {option.label}
              </label>
            </SelectItem>
          ) : (
            <>
              <SelectItem className="ttc mb2">
                <label>
                  <input
                    type="radio"
                    name="dueDate"
                    value={option.id}
                    checked={selectedDueDateOption === option.id}
                    onChange={() => {}}
                  />{' '}
                  {option.label}
                </label>
              </SelectItem>
              <Grid container justifyContent="space-around">
                <DateRangeInput
                  formatDate={(date) => date.toLocaleDateString()}
                  onChange={handleRangeChange}
                  parseDate={(str) => new Date(str)}
                  value={selectedDueDateRange}
                  shortcuts={false}
                  timePickerProps={undefined}
                />
              </Grid>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default DueDatePanel;
