import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import { Form, Field } from 'react-final-form';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { IRoom } from 'stores/room/Reducer';
import { createRoom } from 'stores/room/Actions';
import { CHANGE_ROOM, room } from 'stores/room/Types';

import {
  required,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { checkError } from 'components/final-form/utils';
import { IProject } from 'stores/project/Reducer';

interface ICreateFormProps {
  setShowDialog: (val: boolean) => void;
}

interface ICreateFormInternalProps extends ICreateFormProps {
  createRoom: (val: any) => void;
  errorOnRoomCreate: string;
  creatingRoom: boolean;
  roomLoading: boolean;
  uniqueCompanyName: string;
  currentRoom: IRoom;
  currentProject: IProject;
}

const CreateFormComponent: React.FC<any> = (
  props: ICreateFormInternalProps,
) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit: any = (values: any) => {
    props.createRoom({
      ...values,
      projectId: props.currentProject._id,
      companyId: props.currentProject.company._id,
    });
    setSubmitted(true);
  };

  useEffect(() => {
    if (
      submitted === true &&
      props.creatingRoom === false &&
      props.roomLoading === false &&
      props.errorOnRoomCreate === ''
    ) {
      dispatch({ type: CHANGE_ROOM });
      history.push(
        `/company/${props.uniqueCompanyName}/project/${props.currentRoom.project}?tab=3&discussion=${props.currentRoom._id}`,
      );
      setSubmitted(false);
      props.setShowDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.creatingRoom,
    props.roomLoading,
    submitted,
    props.errorOnRoomCreate,
  ]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{ name: '' }}
      render={({ handleSubmit, submitting, pristine }) => (
        <>
          <form
            className="fl w-100 pa4 pt0 mt4-ns mt5"
            onSubmit={handleSubmit}
          >
            <h1 className="f5 tigrow-lightBlue">Create Room</h1>
            <Field<string>
              name="name"
              validate={composeValidators(required, maxValue(32))}
              render={({ input, meta }) => (
                <InputGroupFieldWithError
                  id={input.name}
                  autoFocus={true}
                  className={`br0 ${
                    checkError(meta) ? 'bb b--red' : 'bb b--lightBlue'
                  }`}
                  placeHolder="Room name"
                  value={input.value}
                  onChange={input.onChange}
                  leftIcon="layout-balloon"
                  leftIconColor={`${
                    checkError(meta) ? 'red' : '#08A0F7'
                  }`}
                  style={{ boxShadow: 'none' }}
                  error={
                    checkError(meta) &&
                    (meta.error || meta.submitError)
                  }
                />
              )}
            />
            {props.errorOnRoomCreate && (
              <small className="red">{props.errorOnRoomCreate}</small>
            )}
            <div className="flex justify-end mt4">
              <Button
                className="grow h2 pointer white bp3-minimal w4 mr3"
                style={{
                  background: '#08A0F7',
                  outline: 'none',
                  color: 'white',
                }}
                loading={submitting}
                type="submit"
                disabled={submitting || pristine}
              >
                Create
              </Button>
              <Button
                className="grow h2 pointer white bp3-minimal w4"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #08A0F7',
                  color: '#08A0F7',
                }}
                onClick={() => {
                  props.setShowDialog(false);
                  dispatch({ type: room.CLEAR_STATUS_CODE });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </>
      )}
    />
  );
};

const mapStateToProps = (state: any) => {
  return {
    errorOnRoomCreate: state.roomReducer.errorOnRoomCreate,
    creatingRoom: state.roomReducer.creatingRoom,
    roomLoading: state.roomReducer.loading,
    uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
    currentRoom: state.roomReducer.currentRoom,
    currentProject: state.projectReducer.projectDetails,
  };
};

export const CreateForm = connect(mapStateToProps, {
  createRoom,
})(CreateFormComponent);
