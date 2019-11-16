import React, { useState } from 'react'
import { InputGroupField } from 'components/common/field/InputGroup';
import { isEmpty } from 'lodash';
import { Button } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect, useStore } from 'react-redux';
import { createRoomAction } from 'stores/room/Actions';

interface CreateFormProps {
  setShowDialog: (val: boolean) => void;
}

interface CreateFormInternalProps extends CreateFormProps, RouteComponentProps {
  createRoomAction: (val: any) => void;
}

const CreateFormComponent = (props: CreateFormInternalProps) => {

  const store = useStore();

  const [values, setValues] = useState({
    name: ""
  });

  const [errors, setErrors] = useState({
    name: ""
  });

  const emptyValueCheck = () => {
    let e = errors;
    if (isEmpty(values.name)) {
      e = { ...e, name: "Required" };
      setErrors(e);
      return true;
    }
    else {
      return false;
    }
  }

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  return (
    <form className="fl w-100 pa4" >
      <h1 className="f5 tigrow-lightBlue">Create Room</h1>
      <div className={` ${errors.name ? "mb3" : "mb4"}`}>
        <div className="flex">
          <InputGroupField
            id="roomName"
            value={values.name}
            onChange={handleChange("name")}
            placeHolder="Room Name"
            leftIcon="layout-balloon"
            style={{
              boxShadow: 'none'
            }}
            className={`br0 ${errors.name ? 'bb b--red' : 'bb b--lightBlue'}`}
            leftIconColor={`${errors.name ? 'red' : "#0fa3a3"}`}
          />
        </div>
        {errors.name ? <small style={{ color: 'red' }}>{errors.name}</small> : ""}
      </div>
      <div className="flex justify-end">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: "#fff", outline: "none", border: "1px solid #0fa3a3", color: "#0fa3a3" }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
          }}
        >
          cancel
        </Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={{ background: "#0fa3a3", outline: "none", color: 'white' }}
          onClick={async (e: any) => {
            e.preventDefault();
            if (!emptyValueCheck()) {
              await props.createRoomAction(values);
              const roomError = store.getState().roomReducer.roomError;
              if (roomError !== "") {
                setErrors({ ...errors, name: roomError });
              } else {
                props.setShowDialog(false);
              }
            }
          }}
        >
          Create
        </Button>
      </div>

    </form>
  )
}

export const CreateForm = connect(null, { createRoomAction })(withRouter(CreateFormComponent));
