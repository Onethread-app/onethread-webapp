import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import Axios from 'axios';
import { server } from 'config';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { formTokenConfig } from 'stores/UtilsActions';
import {
  TaskLabelContainer,
  AddLabelButton,
  LabelHeader,
} from './TaskLabel.styles';
import TaskLabelPopover from './TaskLabelPopover';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { ITask } from 'stores/task/Reducer';

interface ITaskLabelProps {
  currentTask: ITask;
}

const TaskLabel = (props: ITaskLabelProps) => {
  const [suggestedLabels, setSuggestedLabels] = useState<any>([]);
  const [allLabels, setAllLabels] = useState<any>([]);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const [showLabelPopover, setShowLabelPopover] =
    useState<boolean>(false);

  const taskId = props.currentTask._id;

  const loadAllLabels = async (task) => {
    const headers = formTokenConfig(props.currentTask.company._id);
    if ((headers as any).headers.Authorization) {
      try {
        const response = await Axios.get(
          `${server}labels/task/${task}`,
          headers,
        );
        setAllLabels(
          response.data.taskLabels.map((r) => ({
            taskLabelId: r._id,
            labelId: r.label._id,
            name: r.label.name,
            color: r.label.color,
            description: r.label.description,
          })),
        );
      } catch (e: any) {
        if (e.response.data.status === 403) {
          // TODO: show message
        }
      }
    }
  };

  const selectLabelFromSuggestion = async (labelId) => {
    const headers = formTokenConfig(props.currentTask.company._id);
    if ((headers as any).headers.Authorization) {
      try {
        await Axios.post(
          `${server}labels/task/${taskId}`,
          { label: labelId },
          headers,
        );
        await loadAllLabels(taskId);
      } catch (e: any) {
        if (e.response.data.status === 403) {
          // TODO: show message
        }
      }
    }
  };

  const suggestLabels = async (keyword) => {
    const headers = formTokenConfig(props.currentTask.company._id);
    if ((headers as any).headers.Authorization) {
      try {
        const response = await Axios.get(
          `${server}labels/suggest?keyword=${keyword}`,
          headers,
        );
        setSuggestedLabels(
          response.data.data
            .map((x) => x._source)
            .map((a) => ({
              _id: a.mongo_id,
              color: a.color,
              description: a.description,
              name: a.name,
            })),
        );
      } catch (e: any) {
        if (e.response.data.status === 403) {
          // TODO: show message
        }
      }
    }
  };

  const createLabel = async (body) => {
    const headers = formTokenConfig(props.currentTask.company._id);
    if ((headers as any).headers.Authorization) {
      await Axios.post(`${server}labels/`, body, headers);
      await loadAllLabels(taskId);
    }
  };

  const deleteLabel = async (taskLabelId) => {
    setDeleteIsLoading(true);
    const headers = formTokenConfig(props.currentTask.company._id);
    if ((headers as any).headers.Authorization) {
      try {
        await Axios.delete(
          `${server}labels/task-label/${taskLabelId}`,
          headers,
        );
        await loadAllLabels(taskId);
      } catch (e: any) {
        if (e.response.data.status === 403) {
          // TODO: show message
        }
      }
    }
    setDeleteIsLoading(false);
  };

  useEffect(() => {
    loadAllLabels(taskId);
  }, []);

  return (
    <>
      <TaskLabelContainer>
        <LabelHeader>Label:</LabelHeader>
        <Popover
          minimal
          isOpen={showLabelPopover}
          onClose={() => setShowLabelPopover(false)}
          interactionKind="click"
          hasBackdrop={true}
          canEscapeKeyClose={true}
          content={
            <TaskLabelPopover
              suggestedLabels={suggestedLabels}
              suggestLabels={suggestLabels}
              selectLabelFromSuggestion={selectLabelFromSuggestion}
              createLabel={createLabel}
              allLabels={allLabels}
              closePopover={() => setShowLabelPopover(false)}
            />
          }
          target={
            <AddLabelButton onClick={() => setShowLabelPopover(true)}>
              <Icon icon="tag" color="#5a5a5a" className="mr1" />
              Add Label
            </AddLabelButton>
          }
        />
      </TaskLabelContainer>
      {deleteIsLoading ? (
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <CircularProgress />
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {allLabels.map((a, i) => (
            <div
              className="mv1 fl"
              style={{ cursor: 'pointer' }}
              key={i}
            >
              <span
                className="bp3-tag ma1 pv1 ph3 ws-break"
                style={{
                  backgroundColor: !a.color ? '#113CFC' : a.color,
                  color: 'white',
                  fontSize: '13px',
                }}
              >
                {a.name}
                <span
                  className="bp3-tag-remove bp3-icon-delete mh2 w1 h1"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: '30px',
                    paddingTop: 1,
                  }}
                  onClick={async () =>
                    await deleteLabel(a.taskLabelId)
                  }
                ></span>
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
  };
};

export default connect(mapStateToProps)(TaskLabel);
