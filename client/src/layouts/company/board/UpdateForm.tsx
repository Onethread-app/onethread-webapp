import { Button, Icon } from '@blueprintjs/core';
import Axios from 'axios';
import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';
import {
  checkError,
  composeValidators,
  maxValue,
  required,
} from 'components/final-form/utils';
import { server } from 'config';
import { isEqual } from 'lodash';
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { connect } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { clearCurrentBoard, createBoard } from 'stores/board/Actions';
import { TaskBoard } from 'stores/board/Reducer';
import { ICompany } from 'stores/company/Reducer';
import { IProject } from 'stores/project/Reducer';
import { getAllDepartments } from 'stores/company/Actions';
import { Color, tokenConfig } from 'stores/UtilsActions';
import { getAllBoards } from 'stores/board/Actions';

const UpdateFormComponent = (props: {
  getAllBoards: () => void;
  getAllDepartments: () => void;
  setShowTaskBoardDialog: (val: boolean) => void;
  createBoard: (board: TaskBoard) => void;
  clearCurrentBoard: () => void;
  departments: [];
  company: ICompany;
  currentProject: IProject;
  isCreating: boolean;
  selectedBoard: any;
}) => {
  const { selectedBoard } = props;
  const onSubmit = async (values: any) => {
    const headers = tokenConfig();
    try {
      await Axios.post(
        `${server}/boards/update`,
        { ...values, boardId: selectedBoard._id },
        headers,
      );
      await props.clearCurrentBoard();
      await props.getAllBoards();
      props.setShowTaskBoardDialog(false);
    } catch (e) {}
    return {};
  };

  const [labelColor, setLabelColor] = useState(selectedBoard.color);

  return (
    <>
      <div className="pl3" style={{ marginTop: '6rem' }}>
        <h3>Update Board</h3>
      </div>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          name: selectedBoard.name,
          color: selectedBoard.color,
        }}
        render={({
          handleSubmit,
          form,
          submitting,
          pristine,
          values,
          submitError,
          hasValidationErrors,
          ...rest
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="pa3-ns pa2 justify-content w-100">
              <Field<string>
                name="name"
                validate={composeValidators(required, maxValue(32))}
                render={({ input, meta }) => (
                  <div
                    className={` ${checkError(meta) ? 'mb2' : 'mb3'}`}
                  >
                    <InputGroupFieldWithLabel
                      id="name"
                      value={input.value}
                      onChange={input.onChange}
                      style={{
                        boxShadow: 'none',
                        fontSize: '18px',
                      }}
                      error={
                        checkError(meta) &&
                        (meta.error || meta.submitError)
                      }
                      label="Board Name (Required)"
                      autoFocus={true}
                    />
                  </div>
                )}
              />
              <Field<string>
                name="color"
                render={({ input, meta }) => (
                  <div className="mb3">
                    <p
                      className="fw5 mb3"
                      style={{ fontSize: '.8rem' }}
                    >
                      Label
                    </p>
                    <div className="flex">
                      {Color.map((color) => (
                        <div className="pr2" key={color.code}>
                          <Icon
                            className="br2"
                            icon={
                              isEqual(color.code, labelColor) === true
                                ? 'tick'
                                : 'blank'
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              input.onChange(color.code);
                              setLabelColor(color.code);
                            }}
                            style={{
                              backgroundColor: color.value,
                              border:
                                isEqual(color.code, labelColor) ===
                                true
                                  ? '3px solid #ffffff'
                                  : 'none',
                              height: '3rem',
                              padding: '0.8rem',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
              <div className="fr">
                <Button
                  className="grow pointer white bp3-minimal w4 mr3"
                  style={{
                    background: '#3F61C5',
                    outline: 'none',
                    color: 'white',
                  }}
                  loading={submitting}
                  type="submit"
                  disabled={submitting || pristine}
                >
                  Update
                </Button>
                <Button
                  className="w4 grow h2 pointer"
                  style={{
                    background: '#fff',
                    outline: 'none',
                    border: '1px solid #3F61C5',
                    color: '#3F61C5',
                  }}
                  onClick={(e: any) => {
                    if (props.setShowTaskBoardDialog) {
                      props.setShowTaskBoardDialog(false);
                    }
                  }}
                >
                  cancel
                </Button>
              </div>
            </div>
          </form>
        )}
      />
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    departments: state.companyReducer.currentCompany.departments,
    company: state.companyReducer.currentCompany,
    currentProject: state.projectReducer.projectDetails,
    isCreating: state.boardIndexReducer.boardReducer.creatingBoard,
  };
};

export const UpdateFormBoard = connect(mapStateToProps, {
  createBoard,
  clearCurrentBoard,
  getAllBoards,
  getAllDepartments,
})(UpdateFormComponent);
