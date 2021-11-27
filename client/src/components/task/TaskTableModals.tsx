import { Dialog } from '@blueprintjs/core';
import EditTaskDialog from 'components/home/task-section/EditTaskDialog';
import { connect } from 'react-redux';
import { deleteTask } from 'stores/task/Actions';
import { ITask } from 'stores/task/Reducer';
import { Container, Button } from './Task.styles';

interface Props {
  showEditTaskDialog: boolean;
  showDeleteTaskDialog: boolean;
  setShowEditTaskDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowDeleteTaskDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  task: ITask;
  deleteTask: ({ projectId, companyId, type, taskList }) => void;
}

const TaskTableModals = (props: Props) => {
  const {
    showDeleteTaskDialog,
    showEditTaskDialog,
    setShowDeleteTaskDialog,
    setShowEditTaskDialog,
    task,
  } = props;

  const handleDeleteTask = () => {
    props.deleteTask({
      projectId: task.project._id,
      companyId: task.company._id,
      type: 'user',
      taskList: [{ _id: task._id, pid: task.project._id }],
    });
    setShowDeleteTaskDialog(false);
  };

  return (
    <>
      {showEditTaskDialog ? (
        <Dialog
          isOpen={showEditTaskDialog}
          onClose={() => setShowEditTaskDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="h-auto w-auto pb0"
        >
          <EditTaskDialog
            task={task}
            setShowDialog={setShowEditTaskDialog}
          />
        </Dialog>
      ) : null}
      {showDeleteTaskDialog ? (
        <Dialog
          isOpen={showDeleteTaskDialog}
          onClose={() => setShowDeleteTaskDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="h-auto w-auto pb0"
        >
          <Container>
            <div>
              This will delete all the subtasks, files and discussions
              of this task. Do you want to still delete this task?
            </div>
            <div className="flex w-100 justify-center mt3">
              <Button
                type="danger"
                onClick={handleDeleteTask}
                className="mr2 pointer"
              >
                Delete
              </Button>
              <Button
                className="ml2 pointer"
                onClick={() => setShowDeleteTaskDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </Container>
        </Dialog>
      ) : null}
    </>
  );
};

const mapStateToProps = (state: any) => ({});

export default connect(mapStateToProps, { deleteTask })(
  TaskTableModals,
);
