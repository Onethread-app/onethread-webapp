import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { ListTitleView } from './ListTitleView';
import { SectionViewWithTitleAndDesciption } from './ListItemView';
import { BasicInfoForm } from '../editor/BasicInfoDetailsForm';

const CompanyInfoDetailsViewComponent = (props: any) => {
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
          listTitle="Company Address"
          listDescription={props.company.companyAddress}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Company Email Address"
          listDescription={props.company.companyMail}
        />

        <SectionViewWithTitleAndDesciption
          listTitle="Legal Owner"
          listDescription={props.company.legalOwnerName}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Legal owner Email address"
          listDescription={props.company.legalOwnerMail}
        />
      </div>
    </>

  )
}

const mapStateToProps = (state: any) => {
  return {
    company: state.company.createCompany
  }
}

export const CompanyInfoDetailsView = connect(mapStateToProps)(CompanyInfoDetailsViewComponent)