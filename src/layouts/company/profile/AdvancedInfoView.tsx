import React, { useState } from 'react';
import { connect } from 'react-redux';

import addIcon from '../../../resources/images/addIcon.png';
import editIcon from '../../../resources/images/editIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { Divider } from '@blueprintjs/core';
import { ProductEdit } from './ProductEditor';
import { CertificateEdit } from './CertificateEditor';
import { OrganizationEdit } from './ParentOrganizationEditor';
import { ICompany } from 'stores/company/Reducer';

interface AdvancedInfoInternalProps {
  company?: ICompany;
}
const AdvancedInfoComponent = (props: AdvancedInfoInternalProps) => {

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showOrganizationDialog, setShowOrganizationDialog] = useState(false);

  return (
    <>
      <div className="w-100">
        <div>
          <div className="flex justify-between">
            <h1 className="f5">
              Products/Services
			    </h1>
            <img
              src={addIcon}
              width="38"
              className="br2 pointer fr mv1"
              onClick={() => setShowProductDialog(true)}
            />
          </div>
          <Divider />
          <div>
            <p className="f5 fw6">oxford</p>
            <p className="f5 fw6">office shirt</p>
          </div>
        </div>
        <div className="mt4">
          <div className="flex justify-between">
            <h1 className="f5">
              Certificates
			    </h1>
            <img
              src={addIcon}
              width="38"
              className="br2 pointer fr mv1"
              onClick={() => setShowCertificateDialog(true)}
            />
          </div>
          <Divider />
          <div className="flex justify-between items-center mb4">
            <div>
              <h1 className="f5 fw6 ma0">StartUp of the Year</h1>
              <h1 className="f6 silver fw6">When every question has countless different answers</h1>
              {props.company && props.company.certificate && props.company.certificate.length > 0 ?
                props.company.certificate.map((certificate: any) => (
                  <div>
                    <h1 className="f5 fw6 ma0">{certificate.name}</h1>
                    <h1 className="f6 silver fw6">{certificate.description}</h1>
                  </div>
                )) : <h1>No certificates</h1>}
            </div>
            <div>
              <img
                src={editIcon}
                width="38"
                className="br2 pointer"
                onClick={() => setShowCertificateDialog(true)}
              />
            </div>
          </div>
        </div>
        <div className="mt4">
          <div className="flex w-100">
            <h1 className="f5">
              Team Size
			    </h1>
          </div>
          <Divider />
          <p className="fw6 f5">50-100</p>
        </div>
        <div className="mt4">
          <div className="flex justify-between">
            <h1 className="f5">
              Member of Parent Organizations
			    </h1>
            <img
              src={addIcon}
              width="38"
              className="br2 pointer fr mv1"
              onClick={() => setShowOrganizationDialog(true)}
            />
          </div>
          <Divider />
          <div
            className="outline-0"
          >
            {props.company && props.company.parentOrg && props.company.parentOrg.length > 0 ?
              props.company.parentOrg.map((parentOrg: any) => (
                <h1 key={parentOrg._id} className="f5 fw6">{parentOrg.name}</h1>)) : <h1>No organizations</h1>}
          </div>
        </div>
      </div>
      {
        showProductDialog && (
          <RightSidebar
            onClose={() => setShowProductDialog(!showProductDialog)}
          >
            <div>
              <ProductEdit setShowDialog={setShowProductDialog} showDialog={showProductDialog} />
            </div>
          </RightSidebar>
        )
      }
      {
        showCertificateDialog && (
          <RightSidebar
            onClose={() => setShowCertificateDialog(!showCertificateDialog)}
          >
            <div>
              <CertificateEdit setShowDialog={setShowCertificateDialog} />
            </div>
          </RightSidebar>
        )
      }
      {
        showOrganizationDialog && (
          <RightSidebar
            onClose={() => setShowOrganizationDialog(!showOrganizationDialog)}
          >
            <div>
              <OrganizationEdit setShowDialog={setShowOrganizationDialog} />
            </div>
          </RightSidebar>
        )
      }
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany
  };
};

export const AdvancedInfo = connect(mapStateToProps, null)(AdvancedInfoComponent);