import * as React from 'react';
import { ICompany } from 'stores/company/Reducer';
import { useState } from 'react';
import { companyPermit } from 'stores/UtilsActions';
import { Icon, Dialog } from '@blueprintjs/core';
import { CompanyAboutEditor } from './AboutEditor';

export const CompanyAboutView = (props: { company: ICompany }) => {
  const [showDialogAbout, setShowDialogAbout] = useState(false);
  return (
    <>
      <div className="h-auto br3 ma3 pa3 bg-white cf shadow-4 w-50-m">
        <div className="cf ">
          <h1 className="f5 lh-copy dib tigrow-lightGray-1">About</h1>
          {companyPermit(props.company.role, 'editProfile') ? (
            <Icon
              className="fr mv3 tigrow-lightBlue pointer"
              icon="edit"
              onClick={() => setShowDialogAbout(true)}
            />
          ) : (
            ''
          )}
        </div>
        <p className="ws-break" style={{ whiteSpace: 'pre-line' }}>
          {props.company.about}
        </p>
      </div>
      {showDialogAbout && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowDialogAbout(!showDialogAbout)}
          isOpen
          style={{ background: '#fff' }}
        >
          <div>
            <CompanyAboutEditor
              company={props.company}
              setShowDialog={setShowDialogAbout}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};
