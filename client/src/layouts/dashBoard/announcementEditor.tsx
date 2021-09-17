import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { TextArea } from '@blueprintjs/core/lib/esm/components/forms/textArea';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { ICompany } from 'stores/company/Reducer';
import { addAnnouncement } from 'stores/company/Actions';

interface AnnouncementEditorProps {
  setShowDialog: (val: boolean) => void;
  company: ICompany;
  addAnnouncement: (val: any) => void;
  companyId: string;
}

const AnnouncementEditorComponent = (
  props: AnnouncementEditorProps,
) => {
  const { t } = useTranslation();
  const [inputValues, setInputValues] = useState('');
  const [error, setError] = useState(false);
  const [massage, setMessage] = useState(
    'Empty announcement can not be created',
  );

  const validateInput = async () => {
    if (!isEmpty(inputValues) && inputValues.length <= 500) {
      await props.addAnnouncement(inputValues);
      props.setShowDialog(false);
    } else {
      setError(true);

      if (inputValues.length >= 500) {
        setMessage('Announcement can not exceed 500 characters');
      }
    }
  };

  return (
    <>
      <div className="bg-white pa4">
        <h1 className="f5">{t('app.company.Dashboard.Announce')}</h1>
        <TextArea
          className="mt1"
          id="jobDescription"
          style={{
            resize: 'none',
            minHeight: '50px',
            maxHeight: '150px',
          }}
          fill={true}
          growVertically={true}
          value={inputValues}
          placeholder="Write Something (max 500)"
          onChange={(event) => {
            setInputValues(event.target.value);
          }}
        />
        {error ? <h5 className="red">{massage}</h5> : ''}
        <div className="flex justify-end mv2">
          <Button
            type="submit"
            onClick={(e: any) => {
              e.preventDefault();
              validateInput();
            }}
            className="w4 grow h2 pointer mr3"
            style={{
              background: '#34b3e9',
              outline: 'none',
              color: 'white',
            }}
          >
            Submit
          </Button>
          <Button
            className="w4 grow h2 pointer"
            style={{
              background: '#fff',
              outline: 'none',
              border: '1px solid #34b3e9',
              color: '#34b3e9',
            }}
            onClick={(e: any) => {
              e.preventDefault();
              props.setShowDialog(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
  };
};

export const AnnouncementEditor = connect(mapStateToProps, {
  addAnnouncement,
})(AnnouncementEditorComponent);
