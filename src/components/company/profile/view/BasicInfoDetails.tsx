// import * as React from 'react';
// import { ListTitleView } from './ListTitleView';
// import { SectionViewWithTitleAndDesciption } from './ListItemView';

// export const BasicInfoList = () => {
//   return (
//     <>
//       <div className="br3 bg-white h-auto pa4 mt3">
//         <ListTitleView
//           listTitle="Basic Information"
//           iconType="edit"
//         />
//         <SectionViewWithTitleAndDesciption
//           listTitle="Email"
//           listDescription="Julian Martha"
//         />
//         <SectionViewWithTitleAndDesciption
//           listTitle="Secondary Email"
//           listDescription="No secondary email has set"
//         />
//         {/* <InfoListItemIcon
//           listTitle="Contact Number"
//           listDescription="+880-18421421"
//           iconType="lock"
//         /> */}
//         <SectionViewWithTitleAndDesciption
//           listTitle="Contact Number"
//           listDescription="+880-18421421"
//         />
//         <SectionViewWithTitleAndDesciption
//           listTitle="Address"
//           listDescription="Mohakhali DOHS"
//         />
//         <SectionViewWithTitleAndDesciption
//           listTitle="Gender"
//           listDescription="Male"
//         />
//         <SectionViewWithTitleAndDesciption
//           listTitle="Birthdate"
//           listDescription="13th September, 2019"
//         />
//         <SectionViewWithTitleAndDesciption
//           listTitle="Blood Group"
//           listDescription="A+"
//         />
//       </div>
//     </>

//   )
// }

import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ListTitleView } from './ListTitleView';
import { SectionViewWithTitleAndDesciption } from './ListItemView';
import { BasicInfoForm } from '../editor/BasicInfoDetailsForm';

const BasicInfoListComponent = (props: any) => {
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
    users: state.info.user
  }
}

export const BasicInfoDetails = connect(mapStateToProps)(BasicInfoListComponent)