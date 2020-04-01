import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import addIcon from '../../../resources/images/addIcon.png';
import editIcon from '../../../resources/images/editIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { Divider } from '@blueprintjs/core';
import { ProductEdit } from './ProductEditor';
import { CertificateEdit } from './CertificateEditor';
import { OrganizationEdit } from './ParentOrganizationEditor';
import { ICompany } from 'stores/company/Reducer';
import { getAllProduct } from 'stores/company/Actions';

interface AdvancedInfoInternalProps {
  company?: ICompany;
  getAllProduct: () => any;
}

const AdvancedInfoComponent = (props: AdvancedInfoInternalProps) => {

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showOrganizationDialog, setShowOrganizationDialog] = useState(false);

  useEffect(() => {
    async function getAPI() {
      try {
        await props.getAllProduct();
      } catch (error) {
        console.log(error);
      }
    }
    getAPI();
  }, []);

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
          {props.company && props.company.products && props.company.products.length > 0 ?
            props.company.products.map((product: any) => (
              <h1 key={product._id} className="f5 fw4">{product.name}</h1>)) : <p className="f5">No products</p>}
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
          {props.company && props.company.certificate && props.company.certificate.length > 0 ?
            props.company.certificate.map((certificate: any) => (
              <div className="flex justify-between items-center mb4">
                <div>
                  <div>
                    <h1 className="f5 fw4 ma0">{certificate.name}</h1>
                    <h1 className="f6 silver fw4">{certificate.description}</h1>
                  </div>
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
            )) : <p className="f5">No certificates</p>}
        </div>
        <div className="mt4">
          <div className="flex w-100">
            <h1 className="f5">
              Team Size
			    </h1>
          </div>
          <Divider />
          <p className="f5">50-100</p>
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
            {props.company && props.company.parentcom && props.company.parentcom.length > 0 ?
              props.company.parentcom.map((parentcom: any) => (
                <h1 key={parentcom._id} className="f5 fw4">{parentcom}</h1>)) : <p className="f5">No organizations</p>}
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

export const AdvancedInfo = connect(mapStateToProps, { getAllProduct })(AdvancedInfoComponent);