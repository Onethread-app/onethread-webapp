import { Dialog } from '@blueprintjs/core';
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
  handleDeleteTask: () => void;
}

const TaskTableModals = (props: Props) => {
  const {
    showDeleteTaskDialog,
    showEditTaskDialog,
    setShowDeleteTaskDialog,
    setShowEditTaskDialog,
    handleDeleteTask,
  } = props;
  return (
    <>
      {showEditTaskDialog ? (
        <Dialog
          isOpen={showEditTaskDialog}
          onClose={() => setShowEditTaskDialog(false)}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          className="h-auto w-auto pb0"
        ></Dialog>
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
            <div className="flex w-100 justify-center">
              <Button
                type="danger"
                onClick={handleDeleteTask}
                className="mr2"
              >
                Delete
              </Button>
              <Button className="ml2">Cancel</Button>
            </div>
          </Container>
        </Dialog>
      ) : null}
    </>
  );
};

export default TaskTableModals;
