import moment from 'moment';
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './calendarView.css';
import CustomComponents from './CustomComponents';

const localizer = momentLocalizer(moment);

const CalendarView = (props) => {
  const history = useHistory();

  const tasks = [].concat
    .apply(
      [],
      props.currentBoard.columns.map((c) => c.tasks),
    )
    .map((t: any) => ({
      title: t.name,
      start: new Date(t.createdAt),
      end: new Date(t.dueDate),
      allDay: true,
      redirectTo: `/company/${props.uniqueCompanyName}/project/${t.project}/board/${t.boardId}/task/${t._id}`,
      ...t,
    }));

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={tasks}
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

const mapStateToProps = (state: any) => ({
  currentBoard: state.boardIndexReducer.boardReducer.currentBoard,
  uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
  companyId: state.companyReducer.currentCompany._id,
  projectId: state.projectReducer.projectDetails._id,
});

export default connect(mapStateToProps)(CalendarView);
