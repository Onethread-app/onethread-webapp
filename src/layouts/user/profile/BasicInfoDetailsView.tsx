import React from 'react';
import { User } from 'stores/user/Reducer';
import { useState } from 'react';
import { Divider } from '@blueprintjs/core';
import { BasicInfoForm } from './BasicInfoDetailsEditor';
import moment from 'moment';
import { connect } from 'react-redux';
import { RightSidebar } from 'components/RightSidebar';

import editIcon from './../../../resources/images/basicInfoEdit.png';
interface IBasicInfoDetailsViewProps {
  user: User;
}

const BasicInfoDetailsViewComponent = (props: IBasicInfoDetailsViewProps) => {

  const [basicInfoForm, setBasicInfoForm] = useState(false);

  return (
    <>
      <div>
        <div className="relative mb4">
          <div className="flex justify-between items-center">
            <h1 className="f6">Email</h1>
            <p className="black-60 fw4">{props.user.email}</p>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h1 className="f6">Secondary Email</h1>
            <p className="black-60 fw4">{props.user.secondaryEmail}</p>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h1 className="f6">Contact Number</h1>
            <p className="black-60 fw4">{props.user.contactNo}</p>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h1 className="f6">Address</h1>
            <p className="black-60 fw4">{props.user.location}</p>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h1 className="f6">Blood Group</h1>
            <p className="black-60 fw4">{props.user.bloodGroup}</p>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h1 className="f6">Birthdate</h1>
            <p className="black-60 fw4">
              {props.user.birthDate ? moment(props.user.birthDate).format('MM/DD/YYYY') : ''}
            </p>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <h1 className="f6">Gender</h1>
            <p className="black-60 fw4">{props.user.gender}</p>
          </div>
          <Divider />
        </div>
        <div>
          <img
            width="55"
            height="55"
            className="fixed pointer"
            style={{ bottom: '8%', right: '8%' }}
            onClick={() => setBasicInfoForm(true)}
            src={editIcon}
          />
        </div>
      </div>
      {basicInfoForm && (
        <RightSidebar
          onClose={() => setBasicInfoForm(!basicInfoForm)}
        >
            <BasicInfoForm setShowDialog={setBasicInfoForm} />
        </RightSidebar>
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