import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import { companyLogoUploadAction } from 'stores/company/Actions';
import { companyPermit } from 'stores/UtilsActions';

import { CompanyInfoForm } from './BasicInformationEditor';

import addIcon from './../../../resources/images/addIcon.png';

const BasicInfoDetailsViewComponent = (props: any) => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="relative">
        <div className="flex-ns justify-between w-100 mb5-ns mb6">
          <div className="w-50-ns w-100 pr4">
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">
                {t('app.company.Company-profile.Name')}
              </h1>
              <p className="f5">{props.company.name}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">
                {t('app.company.Company-profile.Type')}
              </h1>
              <p className="f5">{props.company.type}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">
                {t('app.company.Company-profile.Address')}
              </h1>
              <p className="f5">{props.company.address}</p>
            </div>
          </div>
          <div className="w-50-ns w-100">
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">
                {t('app.company.Company-profile.Mail-company')}
              </h1>
              <p className="f5">{props.company.email}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">
                {t('app.company.Company-profile.Legal-owner')}
              </h1>
              <p className="f5">{props.company.legalOwnerName}</p>
            </div>
            <div className="bg-white h-auto">
              <h1 className="f6 lh-copy">
                {t('app.company.Company-profile.Legal-mail')}
              </h1>
              <p className="f5">{props.company.legalOwnerMail}</p>
            </div>
          </div>
        </div>
        <div>
          {companyPermit(props.company.role) && (
            <img
              className="fixed pointer addButton"
              style={{
                boxShadow: '0px 6px 6px #00000029',
                borderRadius: '50%',
              }}
              onClick={() => setShowDialog(true)}
              src={addIcon}
            />
          )}
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
