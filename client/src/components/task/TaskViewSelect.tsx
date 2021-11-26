import { Dispatch, SetStateAction, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ViewOption,
  ViewSelectorContainer,
} from './TaskViewSelect.styles';

const getViews = (companyView) => {
  const viewsForProject: Array<'list' | 'board' | 'calendar'> = [
    'list',
    'board',
    'calendar',
  ];
  const viewsForCompany: Array<'list' | 'calendar'> = [
    'list',
    'calendar',
  ];

  if (companyView) return viewsForCompany;
  else return viewsForProject;
};

interface ITaskViewSelect {
  selectedView: 'list' | 'board' | 'calendar';
  setSelectedView: Dispatch<
    SetStateAction<'list' | 'board' | 'calendar'>
  >;
}

const TaskViewSelect = (props: ITaskViewSelect) => {
  const { selectedView, setSelectedView } = props;
  const { projectId }: any = useParams();
  const [views] = useState(getViews(!projectId));

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
