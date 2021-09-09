import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import CustomComponents from './CustomComponents';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendarView.css';

const localizer = momentLocalizer(moment);

export interface ITaskForCalendar {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  redirectTo: string;
  priority: number;
  timeSpent: number;
  _id: string;
  name: string;
  status: string;
  columnId: string;
  boardId: string;
  project: string;
  createdAt: Date;
  dueDate: Date;
  assignedMembers: [
    {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage: string;
    },
  ];
  activityCount: number;
}

interface ICalenderViewProps {
  tasks: ITaskForCalendar[];
}

const CalendarView = (props: ICalenderViewProps) => {
  const history = useHistory();

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={props.tasks}
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
