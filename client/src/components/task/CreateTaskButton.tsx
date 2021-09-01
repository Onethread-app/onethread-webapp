import React, { useState } from 'react';
import styled from 'styled-components';

import { Dialog, Icon } from '@blueprintjs/core';

import CreateTaskDialog from './CreateTaskDialog';
import { useTranslation } from 'react-i18next';

const CreateTaskButtonDiv = styled.div`
  max-width: 200px;
  height: 40px;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  background: #08a0f7;
  color: #fff;

  p {
    margin: 0;
  }
`;

interface ICreateTaskButton {
  columnId: string;
}

const CreateTaskButton = (props: ICreateTaskButton) => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const handleClick = () => {
    setShowDialog(true);
  };
  return (
    <>
      <CreateTaskButtonDiv onClick={handleClick}>
        <Icon icon="plus" color="#fff" className="mr2" />
        <p> {t('app.project.Tasks.Add-task')}</p>
      </CreateTaskButtonDiv>
      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        style={{
          background: '#fff',
          width: '700px',
        }}
      >
        <CreateTaskDialog
          setShowDialog={setShowDialog}
          columnId={props.columnId}
        />
      </Dialog>
    </>
  );
};

export default CreateTaskButton;
