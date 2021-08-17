import React, { useState } from 'react';
import styled from 'styled-components';

import { Dialog, Icon } from '@blueprintjs/core';
import CreateTaskDialog from './CreateTaskDialog';

const CreateTaskButtonDiv = styled.div`
  width: 100%;
  height: 49px;
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px dashed #cacaca;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: ${(props) => (props.columnId ? 'pointer' : 'wait')};

  &:hover {
    background: #f1f1f1;
  }

  p {
    margin: 0;
  }
`;

interface ICreateTaskButton {
  columnId: string;
}

const CreateTaskButton = (props: ICreateTaskButton) => {
  const [showDialog, setShowDialog] = useState(false);
  const handleClick = () => {
    if (props.columnId) setShowDialog(true);
  };
  return (
    <>
      <CreateTaskButtonDiv
        columnId={props.columnId}
        onClick={handleClick}
      >
        <Icon icon="plus" color="#34B3E9" className="mr2" />
        <p>Add new task</p>
      </CreateTaskButtonDiv>
      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        style={{
          background: '#fff',
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
