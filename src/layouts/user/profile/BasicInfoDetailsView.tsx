import React from 'react';
import { User } from 'stores/user/Reducer';
import { useState } from 'react';
import { Icon, Divider, Dialog } from '@blueprintjs/core';
import { BasicInfoForm } from './BasicInfoDetailsEditor';
import moment from 'moment';
import { connect } from 'react-redux';
interface BasicInfoDetailsViewProps {
  user: User;
}

const BasicInfoDetailsViewComponent = (props: BasicInfoDetailsViewProps) => {

  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="br3 bg-white h-auto pa4">
        <div className="cf ">
          <h1 className="f5 lh-copy dib tigrow-lightGray-1">Basic Information</h1>
          <Icon
            className="fr mv3 tigrow-lightBlue pointer"
            icon="edit"
            onClick={() => setShowDialog(true)}
          />
        </div>
        <Divider />

        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Email</h1>
          <p className="f6">{props.user.email}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Secondary Email</h1>
          <p className="f6">{props.user.secondaryEmail}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Contact Number</h1>
          <p className="f6">{props.user.contactNo}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Address</h1>
          <p className="f6">{props.user.location}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Blood Group</h1>
          <p className="f6">{props.user.bloodGroup}</p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Birthdate</h1>
          <p className="f6">
            {props.user.birthDate ? moment(props.user.birthDate).format('MM/DD/YYYY') : ''}
          </p>
        </div>
        <div className="br3 bg-white h-auto">
          <h1 className="f7 lh-copy">Gender</h1>
          <p className="f6">{props.user.gender}</p>
        </div>
      </div>
      {showDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <BasicInfoForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
  };
};

export const BasicInfoDetailsView = connect(mapStateToProps)(BasicInfoDetailsViewComponent);