import React, { useState } from 'react';
import { Dialog } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { CompanyInfoForm } from './BasicInformationEditor';
import { companyLogoUploadAction } from 'stores/company/Actions';
import addIcon from './../../../resources/images/addIcon.png';
import { companyPermit } from 'stores/UtilsActions';

const BasicInfoDetailsViewComponent = (props: any) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <div className="relative">
        <div className="flex-ns justify-between w-100 mb5-ns mb6">
          <div className="w-50 pr4">
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">Company Name</h1>
              <p className="f5">{props.company.name}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">Company Type</h1>
              <p className="f5">{props.company.type}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">Company Address</h1>
              <p className="f5">{props.company.address}</p>
            </div>
          </div>
          <div className="w-50-ns w-100">
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">Company Mail Address</h1>
              <p className="f5">{props.company.email}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">Legal Owner</h1>
              <p className="f5">{props.company.legalOwnerName}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">Legal owner Mail address</h1>
              <p className="f5">{props.company.legalOwnerMail}</p>
            </div>
          </div>
        </div>
        <div>
          {
            companyPermit(props.company.role) && (
              <img
            className="fixed pointer addButton"
            style={{
              boxShadow: '0px 6px 6px #00000029',
              borderRadius: '50%',
            }}
            onClick={() => setShowDialog(true)}
            src={addIcon}
          />
            )
          }
          
        </div>
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <CompanyInfoForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
  };
};

export const BasicInfoDetailsView = connect(mapStateToProps, {
  companyLogoUploadAction,
})(BasicInfoDetailsViewComponent);
