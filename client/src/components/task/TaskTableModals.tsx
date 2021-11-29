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
  taskList: {
    original: ITask;
  }[];
  deleteTask: (task) => void;
  type: string;
}

const TaskTableModals = (props: Props) => {
  const {
    showDeleteTaskDialog,
    showEditTaskDialog,
    setShowDeleteTaskDialog,
    setShowEditTaskDialog,
    taskList,
    type,
  } = props;

  const handleTaskDelete = () => {
    const tasks = taskList.map((row) => row.original._id);
    props.deleteTask({
      taskList: tasks,
      companyId: taskList[0].original.company._id,
      type,
      projectId: taskList[0].original.project._id,
    });
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
            task={taskList[0].original}
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
              of {taskList.length > 1 ? 'these tasks' : 'this task'}.
              Do you want to still delete{' '}
              {taskList.length > 1 ? 'these tasks' : 'this task'}?
            </div>
            <div className="flex w-100 justify-center mt3">
              <Button
                type="danger"
                onClick={() => {
                  handleTaskDelete();
                  props.setShowDeleteTaskDialog(false);
                }}
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
