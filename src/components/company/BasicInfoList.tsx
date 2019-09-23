import React, { useState } from 'react';
import { InfoListItem } from './InfoListItem';
import { InfoListItemIcon } from './InfolistItemIcon';
import { InfoListTitle } from './InfoListTitle';
import { Dialog } from '@blueprintjs/core';
import { BasicInfoForm } from './BasicInfoForm';
import { connect } from 'react-redux';

const BasicInfoListComponent = (props: any) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div className="br3 bg-white h-auto pa4 mt3">
        <InfoListTitle
          listTitle="Basic Information"
          iconType="edit"
          onClick={() => setShowDialog(true)}
        />
        {showDialog && (
          <Dialog
            icon="briefcase"
            onClose={() => setShowDialog(!showDialog)}
            title="Company Sign Up"
            isOpen
            style={{ background: '#fff' }}
          >
            <div>
              <BasicInfoForm />
            </div>
          </Dialog>
        )}
        <InfoListItem
          listTitle="Email"
          listDescription={props.users.email}
        />
        <InfoListItem
          listTitle="Secondary Email"
          listDescription={props.users.secondaryEmail}
        />
        <InfoListItemIcon
          listTitle="Contact Number"
          listDescription={props.users.contactNo}
          iconType="lock"
        />
        <InfoListItem
          listTitle="Address"
          listDescription={props.users.address}
        />
        <InfoListItem
          listTitle="Gender"
          listDescription="Male"
        />
        <InfoListItem
          listTitle="Birthdate"
          listDescription="13th September, 2019"
        />
        <InfoListItem
          listTitle="Blood Group"
          listDescription={props.users.bloodGroup}
        />
      </div>
    </>

  )
}

const mapStateToProps = (state: any) => {
  return {
    users: state.info.user
  }
}

export const BasicInfoList = connect(mapStateToProps)(BasicInfoListComponent)