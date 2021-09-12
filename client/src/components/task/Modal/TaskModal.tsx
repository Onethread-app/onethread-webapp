import React from 'react';

import TaskPage from 'layouts/company/task';

import { ModalWrapper, Modal } from './TaskModal.styles';

const TaskModal = () => {
  return (
    <ModalWrapper>
      <Modal>
        <TaskPage />
      </Modal>
    </ModalWrapper>
  );
};

export default TaskModal;
