import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import CustomComponents from './CustomComponents';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendarView.css';
import { priorityColor } from 'stores/UtilsActions';

const localizer = momentLocalizer(moment);

export interface ITaskForCalendar {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  redirectTo: string;
  priority: number;
  status?: string;
  project?: string;
  assignee?: string[];
  dueDate?: Date;
}

interface ICalendarViewProps {
  tasks: ITaskForCalendar[];
  filterOptions?: Object;
}

const CalendarView = (props: ICalendarViewProps) => {
  const history = useHistory();

  let taskList = [...props.tasks];
  let filterList = props.filterOptions;
  if (!filterList) filterList = {};

  const lwrCs = (a) => (typeof a === 'string' ? a.toLowerCase() : a);

  for (let key in filterList) {
    if (filterList[key].length === 0) continue;
    if (key === 'project' || key === 'status') {
      taskList = taskList.filter((t) => {
        const flist = filterList ? filterList[key] : [];
        return flist.find((f) => {
          return lwrCs(f.label) === lwrCs(t[key]);
        });
      });
    } else if (key === 'priority') {
      taskList = taskList.filter((t) => {
        const flist = filterList ? filterList[key] : [];
        const pColor: any = priorityColor.find(
          (c) => c.code === t.priority,
        );
        return flist.find((f) => {
          return lwrCs(f.label) === lwrCs(pColor.name);
        });
      });
    } else if (key === 'assignee') {
      taskList = taskList.filter(() => {
        const flist = filterList ? filterList[key] : [];
        return flist.find((f) =>
          taskList.some((tt: any) =>
            tt.assignee.some(
              (ta) =>
                lwrCs(`${ta.firstName} ${ta.lastName}`) ===
                lwrCs(f.label),
            ),
          ),
        );
      });
    } else if (key === 'dueDate') {
      taskList = taskList.filter((t) => {
        const dueDateFilter = filterList ? filterList[key] : {};
        const dateOne = new Date(dueDateFilter.label);
        const dateTwo = new Date(t.dueDate ? t.dueDate : '');
        return dateOne.getTime() === dateTwo.getTime();
      });
    }
  }
  if (taskList.length === 0) taskList = props.tasks;

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={taskList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 550 }}
        drilldownView="agenda"
        popup={true}
        step={15}
        timeslots={4}
        messages={{
          previous: 'Previous',
        }}
        components={{
          eventWrapper: CustomComponents.eventWrapper(history),
        }}
        formats={{
          weekdayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd', culture),
        }}
      />
    </div>
  );
};

export default CalendarView;
