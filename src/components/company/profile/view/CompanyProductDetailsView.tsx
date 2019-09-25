import React, { useState } from 'react';
import { ListTitleView } from './ListTitleView';
import { BasicInfoForm } from '../editor/BasicInfoDetailsForm';
import { Dialog } from '@blueprintjs/core';
import { SectionViewWithTitleAndDesciption } from './ListItemView';
import { connect } from 'react-redux';

const CompanyProductDetailsViewComponent = (props:any) => {
  const [showDialog,setShowDialog]= useState(false)
  return (
    <>
      <div className="br3 bg-white h-auto pa4 mt3">
        <ListTitleView
          listTitle="Product Details"
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
          listTitle="Product Type"
          listDescription={props.company.companyAddress}
        />
        <SectionViewWithTitleAndDesciption
          listTitle="Product Sub Categories"
          listDescription={props.company.companyMail}
        />

        <SectionViewWithTitleAndDesciption
          listTitle="Product Name"
          listDescription={props.company.legalOwnerName}
        />
      </div>
    </>
  )
}

const mapStateToProps = (state: any) => {
  console.log('mithhu', state.company.createCompany);
  return {
    company: state.company.createCompany
  }
}

export const CompanyProductDetailsView = connect(mapStateToProps)(CompanyProductDetailsViewComponent)