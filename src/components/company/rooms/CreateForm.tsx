import React, { useState, useEffect } from 'react'
import { InputGroupField } from 'components/common/field/InputGroup';
import { isEmpty } from 'lodash';
import { Button } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect, useStore } from 'react-redux';
import { createRoomAction, clearRoomError } from 'stores/room/Actions';

interface CreateFormProps {
  setShowDialog: (val: boolean) => void;
}

interface CreateFormInternalProps extends CreateFormProps, RouteComponentProps {
  createRoomAction: (val: any) => void;
  clearRoomError: () => void;
  roomError: string;
  loading: boolean;
}

const CreateFormComponent = (props: CreateFormInternalProps) => {

  const [values, setValues] = useState({
    name: ""
  });

  const [errors, setErrors] = useState({
    name: ""
  });

  useEffect(() => {
    setErrors({ ...errors, name: props.roomError });
  }, [props.roomError]);

  const emptyErrorCheck = () => {
    if (isEmpty(errors.name)) {
      return true;
    } else {
      return false;
    }
  }

  const emptyValueCheck = () => {
    if (isEmpty(values.name)) {
      return true;
    }
    else {
      return false;
    }
  }

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: value === "" ? "Required" : "" });
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
            props.clearRoomError();
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
            if (!emptyValueCheck() && emptyErrorCheck()) {
              await props.createRoomAction(values);
            }
          }}
        >
          Create
        </Button>
      </div>

    </form>
  )
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.roomReducer.loading,
    roomError: state.roomReducer.roomError
  };
};

export const CreateForm = connect(mapStateToProps, { createRoomAction, clearRoomError })(withRouter(CreateFormComponent));
