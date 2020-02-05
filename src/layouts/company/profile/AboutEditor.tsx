import * as React from 'react';
import { CompanyModel } from 'stores/company/Reducer';
import { useState } from 'react';
import { Divider, Button, TextArea } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { editCompanyAboutAction } from 'stores/company/Actions';
import { isEmpty } from 'lodash';

interface CompanyAboutEditComponentProps {
  setShowDialog: (val: boolean) => void;
  company: CompanyModel;
}
interface CompanyAboutEditInternalProps extends CompanyAboutEditComponentProps {
  editInfoAction: (val: string) => void;
}

const CompanyAboutEditorComponent = (props: CompanyAboutEditInternalProps) => {
  const [aboutInfo, setAboutInfo] = useState(props.company.about ? props.company.about : '');
  const [aboutInfoError, setAboutInfoError] = useState('');

  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-copy dib tigrow-lightGray-1 fl w-100">About</h1>
      <TextArea
        className="mb4 fl w-100"
        style={{ resize: 'none' }}
        rows={5}
        growVertically={false}
        large={true}
        onChange={e => {
          if (aboutInfo && aboutInfo.length > 2000) {
            setAboutInfoError('About must be less than or equal 2000 character.');
          } else {
            setAboutInfoError('');
            setAboutInfo(e.target.value);
          }
        }}
        value={aboutInfo}
      />
      {aboutInfoError ? <small style={{ color: 'red' }}>{aboutInfoError}</small> : ''}
      <Divider />
      <div className="flex w-100 justify-end mt3">
        <Button className="w4 grow h2 pointer mr3"
          style={{ background: '#fff', outline: 'none', border: '1px solid #0fa3a3', color: '#0fa3a3' }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
          }}
        >
          cancel
        </Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={{ background: '#0fa3a3', outline: 'none', color: 'white' }}
          onClick={(e: any) => {
            e.preventDefault();
            if (isEmpty(aboutInfoError)) {
              props.editInfoAction(aboutInfo);
              props.setShowDialog(false);
            }
          }}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
export const CompanyAboutEditor = connect(null,
  { editInfoAction: editCompanyAboutAction })(CompanyAboutEditorComponent);