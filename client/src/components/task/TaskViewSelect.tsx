import { Dispatch, SetStateAction } from 'react';
import {
  ViewOption,
  ViewSelectorContainer,
} from './TaskViewSelect.styles';

const views: Array<'list' | 'board' | 'calendar'> = [
  'list',
  'board',
  'calendar',
];

interface ITaskViewSelect {
  selectedView: 'list' | 'board' | 'calendar';
  setSelectedView: Dispatch<
    SetStateAction<'list' | 'board' | 'calendar'>
  >;
}

const TaskViewSelect = (props: ITaskViewSelect) => {
  const { selectedView, setSelectedView } = props;

  return (
    <ViewSelectorContainer>
      <label htmlFor="">View:</label>
      {views.map((view) => (
        <ViewOption
          onClick={() => {
            localStorage.setItem('selectedView', view);
            setSelectedView(view);
          }}
          selected={selectedView === view}
          key={view}
        >
          {view}
        </ViewOption>
      ))}
    </ViewSelectorContainer>
  );
};

export default TaskViewSelect;
