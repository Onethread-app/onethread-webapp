import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ListTitleView } from './ListTitleView';
import { SectionViewWithTitleAndDesciption } from './ListItemView';
import { BasicInfoForm } from '../editor/BasicInfoDetailsForm';

const BasicInfoDetailsViewComponent = (props: any) => {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <div className="br3 bg-white h-auto pa4 mt3">
        <ListTitleView
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
        <SectionViewWithTitleAndDesciption
          listTitle="Email"
          listDescription={props.users.email}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Secondary Email"
          listDescription={props.users.secondaryEmail}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Contact Number"
          listDescription={props.users.contactNo}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Address"
          listDescription={props.users.address}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Gender"
          listDescription="Male"
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Birthdate"
          listDescription="13th September, 2019"
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Blood Group"
          listDescription={props.users.bloodGroup}
        />
      </div>
    </>

  )
}

const mapStateToProps = (state: any) => {
  return {
    users: state.userReducer.user
  }
}

export const BasicInfoDetailsView = connect(mapStateToProps)(BasicInfoDetailsViewComponent)