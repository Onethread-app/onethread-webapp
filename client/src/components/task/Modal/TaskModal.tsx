import { TaskPage } from 'layouts/company/task';

import { ModalWrapper, Modal } from './TaskModal.styles';

const TaskModal = () => (
  <ModalWrapper>
    <Modal>
      <TaskPage />
    </Modal>
  </ModalWrapper>
);

export default TaskModal;
