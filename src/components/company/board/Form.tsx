import React, { useState } from 'react'
import { InputGroupField } from 'components/common/field/InputGroup';
import { Button, Spinner } from '@blueprintjs/core';
import { isEmpty } from 'lodash';
import { createBoard } from 'stores/board/Actions';
import { TaskBoard } from 'stores/board/Reducer';
import { connect } from 'react-redux';

const FormComponent = (props: {
  loading: boolean;
  setShowTaskBoardDialog?: (val: boolean) => void;
  createBoard: (board: TaskBoard) => void;
}) => {

  const [board, setBoard] = useState({
    name: "",
    description: "",
  });

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setBoard({ ...board, [name]: value });
  };

  return (
    <div className="pa3">
      <div className="mb3 w-100">
        <InputGroupField
          id="board_name"
          className={`br0 bb b--lightBlue`}
          value={board.name}
          onChange={handleChange("name")}
          placeHolder="Board title"
          leftIcon="clipboard"
          style={{
            boxShadow: 'none'
          }}
        />
      </div>
      <div className="mb3 w-100">
        <InputGroupField
          id="board_description"
          className={`br0 bb b--lightBlue`}
          value={board.description}
          onChange={handleChange("description")}
          placeHolder="Board description"
          leftIcon="clipboard"
          style={{
            boxShadow: 'none'
          }}
        />
      </div>
      <div className="flex justify-end">
        <Button
          className="grow h2 pointer white bp3-minimal w4 mr3"
          style={{
            background: "#fff",
            outline: "none",
            border: "1px solid #0fa3a3",
            color: "#0fa3a3"
          }}
          text="Cancel"
          onClick={(e: any) => {
            e.preventDefault();
            if (props.setShowTaskBoardDialog) {
              props.setShowTaskBoardDialog(false);
            }
          }}
        />
        <Button
          className="grow pointer white bp3-minimal w4"
          type="submit"
          style={isEmpty(board.name) === false ?
            {
              background: "#0fa3a3",
              outline: "none",
              color: 'white'
            } : {
              background: '#011b1b2e',
              outline: "none",
              color: 'white'
            }
          }
          disabled={props.loading ? true : isEmpty(board.name)}
          text={props.loading ? <Spinner size={15} /> : 'Create board'}
          onClick={async (e: any) => {
            e.preventDefault();
            await props.createBoard(board);
            setBoard({ name: "", description: "" });
            if (props.setShowTaskBoardDialog) {
              props.setShowTaskBoardDialog(false);
            }
          }}
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.taskManagementReducer.boardReducer.loading
  }
}

export const Form = connect(mapStateToProps, { createBoard })(FormComponent);
