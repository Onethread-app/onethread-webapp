import React, { useState } from 'react';
import { connect } from 'react-redux';

import addIcon from '../../../resources/images/addIcon.png';
import editIcon from '../../../resources/images/editIcon.png';
import { RightSidebar } from 'components/RightSidebar';
import { Divider } from '@blueprintjs/core';
import { ProductEdit } from './ProductEditor';
import { CertificateEdit } from './CertificateEditor';
import { OrganizationEdit } from './ParentOrganizationEditor';

const AdvancedInfoComponent = () => {

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
              <h1 className="f6 blue fw6 ma0">Startup.png</h1>
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
            className="bp3-minimal outline-0 bp3-popover-dismiss"
          >
            <div className="dtc w2 w3-ns">
              <h1 className="db w2 w3-ns h2 h3-ns br-100 ba b--black-10 bg-blue white tc f3 pt3">
                a
              </h1>
            </div>
            <div className="dtc v-mid pl3">
              <h1 className="f5 lh-title black mv0">
                tigrow
              </h1>
              <h1 className="f7 f6-ns lh-title silver">
                Business Type
              </h1>
            </div>
          </div>
        </div>
      </div>
      {showProductDialog && (
        <RightSidebar
          onClose={() => setShowProductDialog(!showProductDialog)}
        >
          <div>
            <ProductEdit setShowDialog={setShowProductDialog} />
          </div>
        </RightSidebar>
      )}
      {showCertificateDialog && (
        <RightSidebar
          onClose={() => setShowCertificateDialog(!showCertificateDialog)}
        >
          <div>
            <CertificateEdit setShowDialog={setShowCertificateDialog} />
          </div>
        </RightSidebar>
      )}
      {showOrganizationDialog && (
        <RightSidebar
          onClose={() => setShowOrganizationDialog(!showOrganizationDialog)}
        >
          <div>
            <OrganizationEdit setShowDialog={setShowOrganizationDialog} />
          </div>
        </RightSidebar>
      )}
    </>
  );
};

export const AdvancedInfo = connect(null, null)(AdvancedInfoComponent);