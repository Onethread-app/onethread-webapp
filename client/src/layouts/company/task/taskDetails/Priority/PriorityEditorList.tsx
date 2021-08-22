import React, { useState } from 'react';
import { priorityColor } from 'stores/UtilsActions';
import { connect } from 'react-redux';
import { updateTask } from 'stores/board/Actions';
import { ITask } from 'stores/board/Reducer';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface IPriorityEditorProps {
  updateTask: (task: ITask) => any;
  colorCode: Number;
  updatingTask: boolean;
}

const TagSelectPriority = styled.select`
  color: ${(props) =>
    props.colorCode === 0
      ? '#F44135'
      : props.colorCode === 1
      ? '#CB5800'
      : props.colorCode === 2
      ? '#08A0F7'
      : props.colorCode === 3
      ? '#5387AF'
      : props.colorCode === 4
      ? '#093F68'
      : '#000'};
  background: #f6f6f6;
  border-radius: 3px;
  padding: 0.2rem 0.5rem;
  margin: 0;
  width: auto;
  min-width: 11rem;
  max-width: 215px;
  font-family: inherit;
  font-size: 14px;
  cursor: inherit;
  line-height: inherit;
  border: 1px solid #b1b1b1;
`;

export const PriorityEditorListComponent = (
  props: IPriorityEditorProps,
) => {
  // console.log('code', props.colorCode);
  const [selectedPriority, setSelectedPriority] = useState<any>({
    value: props.colorCode,
  });

  const handlePriorityChange = async (e) => {
    setSelectedPriority(e.target.value);
    const values: any = {
      priority: e.target.value,
    };
    await props.updateTask(values);
  };

  const handlePriorityClick = (e) => {
    e.stopPropagation();
  };

  const { t } = useTranslation();

  return (
    <div className="task-info-items">
      <h1 className="f6">
        {t('app.project.Project-boards.Priority')}:
      </h1>
      <TagSelectPriority
        name="priority"
        id="taskPriority"
        onClick={handlePriorityClick}
        onChange={handlePriorityChange}
        value={selectedPriority.value}
        colorCode={props.colorCode}
      >
        {priorityColor.map((color) => (
          <option
            key={color.code}
            value={color.code}
            style={{
              color:
                color.code === 0
                  ? '#C43600'
                  : color.code === 1
                  ? '#CB5800'
                  : color.code === 2
                  ? '#08A0F7'
                  : color.code === 3
                  ? '#5387AF'
                  : color.code === 4
                  ? '#093F68'
                  : '#000',
            }}
          >
            {color.name}
          </option>
        ))}
      </TagSelectPriority>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    colorCode:
      state.boardIndexReducer.boardReducer.currentTask.priority,
    updatingTask: state.boardIndexReducer.boardReducer.updatingTask,
  };
};

export const PriorityEditorList = connect(mapStateToProps, {
  updateTask,
})(PriorityEditorListComponent);
