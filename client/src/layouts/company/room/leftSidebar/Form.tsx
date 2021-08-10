import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { Button } from '@blueprintjs/core';
import { createRoom } from 'stores/room/Actions';
import { Form, Field } from 'react-final-form';
import {
  required,
  composeValidators,
  maxValue,
} from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { checkError } from 'components/final-form/utils';
import { room } from 'stores/room/Types';
import { IRoom } from 'stores/room/Reducer';

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
}

const CreateFormComponent: React.FC<any> = (
  props: ICreateFormInternalProps,
) => {
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const onSubmit: any = (values: any) => {
    props.createRoom(values);
    setSubmitted(true);
  };

  useEffect(() => {
    if (
      submitted === true &&
      props.creatingRoom === false &&
      props.errorOnRoomCreate === ''
    ) {
      const query = new URLSearchParams(location.search);
      const view =
        query.get('view') && query.get('view') === 'mobile'
          ? 'mobile'
          : 'default';
      history.push(
        `/company/${props.uniqueCompanyName}/project/${props.currentRoom.project}/room?roomId=${props.currentRoom._id}&view=${view}`,
      );
      setSubmitted(false);
      props.setShowDialog(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.creatingRoom]);

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
                    checkError(meta) ? 'red' : '#34b3e9'
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
                  background: '#34b3e9',
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
                  border: '1px solid #34b3e9',
                  color: '#34b3e9',
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
  };
};

export const CreateForm = connect(mapStateToProps, {
  createRoom,
})(CreateFormComponent);
