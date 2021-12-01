import {
  Row,
  SimpleTextButton,
} from 'components/home/task-section/TaskSection.styles';
import { connect } from 'react-redux';
import reload from 'resources/images/reload.png';
import {
  reloadTaskList,
  taskMarkAsCompleted,
} from 'stores/task/Actions';
import { ITask } from 'stores/task/Reducer';
import { addItemToTrack } from 'stores/time-tracker/Action';
import { ICurrentTrack } from 'stores/time-tracker/Reducer';

interface Props {
  selectedTask: {
    original: ITask;
  }[];
  setShowDeleteTaskDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowEditTaskDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  taskMarkAsCompleted: (payload: any) => void;
  addItemToTrack: (payload: ICurrentTrack) => void;
  reloadTaskList: (type: string) => void;
  type: string;
}

const TaskTableActions = (props: Props) => {
  const {
    selectedTask,
    setShowDeleteTaskDialog,
    setShowEditTaskDialog,
    type,
  } = props;

  const handleMarkAsComplete = () => {
    const task = selectedTask.map((row) => ({
      _id: row.original._id,
      pid: row.original.project._id,
    }));
    props.taskMarkAsCompleted({
      task,
      companyId: selectedTask[0].original.company._id,
      type,
    });
  };

  const handleTaskEdit = () => {
    setShowEditTaskDialog(true);
  };

  const handleTimer = () => {
    const task = selectedTask[0].original;
    const payload = {
      name: task.name,
      task: task._id,
      column: task.status._id, // need to change
      project: task.project._id,
      company: task.company._id,
      startTime: new Date(),
      duration: 0,
    };
    props.addItemToTrack(payload);
  };

  const handleReloadTaskList = () => {
    props.reloadTaskList(type);
  };

  return (
    <Row>
      <SimpleTextButton onClick={handleReloadTaskList}>
        <img src={reload} alt="reload icon" />
      </SimpleTextButton>
      <SimpleTextButton
        disabled={selectedTask.length === 0}
        onClick={() => handleMarkAsComplete()}
      >
        Mark As Complete
      </SimpleTextButton>
      <SimpleTextButton
        disabled={selectedTask.length !== 1}
        onClick={() => handleTaskEdit()}
      >
        Edit
      </SimpleTextButton>
      <SimpleTextButton
        disabled={selectedTask.length === 0}
        onClick={() => setShowDeleteTaskDialog(true)}
      >
        Delete
      </SimpleTextButton>
      <SimpleTextButton
        disabled={selectedTask.length !== 1}
        onClick={handleTimer}
      >
        Track Time
      </SimpleTextButton>
    </Row>
  );
};

const mapStateToProps = (state: any) => ({});

export default connect(mapStateToProps, {
  taskMarkAsCompleted,
  addItemToTrack,
  reloadTaskList,
})(TaskTableActions);
