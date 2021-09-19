import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Position } from '@blueprintjs/core/lib/esm/common/position';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';

import { CompanyListView } from 'layouts/company/ListView';
import { CompanySignupForm } from 'layouts/company/Form';

import './CompanyPopoverIcon.scss';

interface ICompanyPopoverIcon {
  type: string;
}

const CompanyPopoverIcon = (props: ICompanyPopoverIcon) => {
  const { t } = useTranslation();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Popover
        popoverClassName="bp3-popover-content-sizing bg-white padding-fix"
        position={Position.BOTTOM}
        content={
          <CompanyListView
            showDialog={showDialog}
            setShowDialog={setShowDialog}
          />
        }
        target={
          <Button
            className="bp3-minimal dim f6 f5-l dib mr3 mr4-l outline-0"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid',
              color: props.type === 'home' ? 'white' : 'dark-gray',
            }}
            text={t('app.homepage.My-Companies')}
          />
        }
      />
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <CompanySignupForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default CompanyPopoverIcon;
