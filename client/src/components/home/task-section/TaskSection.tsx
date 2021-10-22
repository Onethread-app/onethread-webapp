import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { Header, Modal, Row } from './TaskSection.styles';
import Hamburger from '../../../resources/images/hamburger.png';
import TaskDialog from './TaskDialog';
import { connect } from 'react-redux';

interface Props {
  userTasks: any;
  useToaster: () => {
    showToaster: boolean;
    successMessage: string;
    errorMessage: string;
    setShowToaster: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  };
}

const TaskSection = (props: Props) => {
  const [openTaskDialog, setOpenTaskDialog] =
    useState<boolean>(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(props.userTasks);
  }, [props.userTasks]);
  return (
    <div>
      <Header>
        Tasks
        <img src={Hamburger} alt="" />
      </Header>
      {tasks.length === 0 ? (
        <Row>
          No task has been created.{' '}
          <Link to="#" onClick={() => setOpenTaskDialog(true)}>
            Create Task
          </Link>
        </Row>
      ) : (
        <Row>
          {tasks.length} tasks found.{' '}
          <Link to="#" onClick={() => setOpenTaskDialog(true)}>
            Create Task
          </Link>
        </Row>
      )}
      {openTaskDialog ? (
        <Modal>
          <TaskDialog
            setShowDialog={setOpenTaskDialog}
            useToaster={props.useToaster}
          />
        </Modal>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  userTasks: state.taskIndexReducer.taskReducer.userTasks,
});

export default connect(mapStateToProps, {})(TaskSection);
